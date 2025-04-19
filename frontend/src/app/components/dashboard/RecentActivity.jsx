import { FaUserPlus, FaComment, FaStar, FaDollarSign, FaCog } from 'react-icons/fa';

export default function RecentActivity({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <div className="p-2 bg-green-100 rounded-full"><FaUserPlus className="text-green-600" /></div>;
      case 'comment':
        return <div className="p-2 bg-blue-100 rounded-full"><FaComment className="text-blue-600" /></div>;
      case 'rating':
        return <div className="p-2 bg-yellow-100 rounded-full"><FaStar className="text-yellow-600" /></div>;
      case 'revenue':
        return <div className="p-2 bg-emerald-100 rounded-full"><FaDollarSign className="text-emerald-600" /></div>;
      case 'system':
        return <div className="p-2 bg-purple-100 rounded-full"><FaCog className="text-purple-600" /></div>;
      default:
        return <div className="p-2 bg-gray-100 rounded-full"><FaCog className="text-gray-600" /></div>;
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className="mr-4 flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm text-gray-800">{activity.content}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          <p>No recent activity to display</p>
        </div>
      )}
      
      {activities.length > 0 && (
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2">
          View All Activity
        </button>
      )}
    </div>
  );
}