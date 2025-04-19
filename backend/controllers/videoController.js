const Video = require("../models/Video");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const assemblyAIKey = process.env.ASSEMBLYAI_API_KEY;    
// POST /upload/:courseId
exports.uploadVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { path: videoUrl } = req.file;

    const video = await Video.create({
      title: req.body.title || "Untitled Video",
      course: courseId,
      videoUrl,
      order: req.body.order || 0,
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

// PATCH /reorder/:courseId
exports.reorderVideos = async (req, res) => {
  const { courseId } = req.params;
  const { reorderedIds } = req.body;

  try {
    await Promise.all(
      reorderedIds.map((id, idx) =>
        Video.findByIdAndUpdate(id, { order: idx })
      )
    );

    res.json({ message: "Videos reordered" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reorder videos" });
  }
};

// PATCH /:id
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.videoUrl = req.file.path;
    await video.save();

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

const downloadVideo = async (url, outputPath) => {
  const response = await axios({ url, method: "GET", responseType: "stream" });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(outputPath));
    writer.on("error", reject);
  });
};

// POST /transcribe/:videoId
exports.generateTranscript = async (req, res) => {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) return res.status(404).json({ message: "Video not found" });
  
      const tempVideoPath = path.join(__dirname, `../temp/video-${Date.now()}.mp4`);
      const tempAudioPath = path.join(__dirname, `../temp/audio-${Date.now()}.mp3`);
  
      // Step 1: Download video from Cloudinary
      await downloadVideo(video.videoUrl, tempVideoPath);
  
      // Step 2: Extract audio using FFmpeg
      ffmpeg(tempVideoPath)
        .output(tempAudioPath)
        .on('end', async () => {
          try {
            // Step 3: Upload audio to AssemblyAI for transcription
            const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', fs.createReadStream(tempAudioPath), {
              headers: {
                'authorization': assemblyAIKey,
              },
            });
  
            const audioUrl = uploadResponse.data.upload_url;
  
            // Step 4: Request transcription from AssemblyAI
            const transcriptionResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
              audio_url: audioUrl,
            }, {
              headers: {
                'authorization': assemblyAIKey,
              },
            });
  
            const transcriptId = transcriptionResponse.data.id;
  
            // Step 5: Polling for transcription result
            const pollTranscriptionStatus = async (attempts = 0) => {
              if (attempts >= 20) {
                return res.status(500).json({ error: 'Transcription failed after multiple attempts' });
              }
  
              // Wait for a few seconds before checking the status again
              await new Promise((resolve) => setTimeout(resolve, 5000));
  
              const resultResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: {
                  'authorization': assemblyAIKey,
                },
              });
  
              if (resultResponse.data.status === 'completed') {
                // Save the transcript to the video record
                video.transcript = resultResponse.data.text;
                await video.save();
  
                // Cleanup
                fs.unlinkSync(tempVideoPath);
                fs.unlinkSync(tempAudioPath);
  
                res.json({
                  message: 'Transcript saved successfully',
                  transcript: resultResponse.data.text,
                });
              } else if (resultResponse.data.status === 'failed') {
                // If transcription failed
                res.status(500).json({ error: 'Transcription failed' });
              } else {
                // Recursively check again after 5 seconds
                await pollTranscriptionStatus(attempts + 1);
              }
            };
  
            // Start polling
            await pollTranscriptionStatus();
  
          } catch (err) {
            fs.unlinkSync(tempVideoPath); // Clean up the video file in case of error
            fs.unlinkSync(tempAudioPath); // Clean up the audio file in case of error
            res.status(500).json({ error: 'Audio extraction or transcription failed', details: err.message });
          }
        })
        .on('error', (err) => {
          fs.unlinkSync(tempVideoPath); // Clean up the video file in case of error
          fs.unlinkSync(tempAudioPath); // Clean up the audio file in case of error
          res.status(500).json({ error: 'Audio extraction failed', details: err.message });
        })
        .run();
    } catch (err) {
      res.status(500).json({ error: "Something went wrong", details: err.message });
    }
  };

  exports.getVideosByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const videos = await Video.find({ course: courseId }).sort({ order: 1 });
  
      res.status(200).json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  