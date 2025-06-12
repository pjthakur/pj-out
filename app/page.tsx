"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaLinkedin,
  FaSearch,
  FaHome,
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaBell,
  FaUser,
  FaVideo,
  FaImage,
  FaSortDown,
  FaThumbsUp,
  FaComment,
  FaUserPlus,
  FaPuzzlePiece,
  FaAd,
  FaAngleDown,
  FaAngleUp,
  FaEdit,
  FaPaperPlane,
  FaCheck,
  FaGlobeAmericas,
  FaShare,
  FaTimes,
  FaCheckCircle,
  FaBars,
} from "react-icons/fa";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  comments: { id: number; author: string; text: string; time: string }[];
  reposts: number;
  shares: number;
  image?: string;
  video?: string;
  company?: string;
}

interface Connection {
  id: number;
  name: string;
  title: string;
  mutual: number;
  isConnected: boolean;
  isFollowing: boolean;
  company: string;
}

interface Profile {
  name: string;
  description: string;
  location: string;
  picture: string;
  connections: number;
  followers: number;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

const Toast: React.FC<{ toast: Toast; onClose: (id: number) => void }> = ({
  toast,
  onClose,
}) => (
  <div
    className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[100] px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
      toast.type === "success"
        ? "bg-green-500 text-white"
        : "bg-red-500 text-white"
    }`}
  >
    <div className="flex items-center justify-between space-x-3">
      <div className="flex items-center space-x-2">
        {toast.type === "success" && <FaCheckCircle />}
        <span className="font-medium text-sm md:text-base">{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white hover:text-gray-200 transition-colors cursor-pointer flex-shrink-0"
      >
        <FaTimes />
      </button>
    </div>
  </div>
);

interface NetworkPageProps {
  connections: Connection[];
  handleFollow: (connectionId: number) => void;
  profileImages: { [key: string]: string };
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  connections,
  handleFollow,
  profileImages,
}) => {
  const [activeTab, setActiveTab] = useState<"connections" | "followers">(
    "connections"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Network</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-800"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("connections")}
            className={`pb-4 px-1 font-medium cursor-pointer ${
              activeTab === "connections"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`pb-4 px-1 font-medium cursor-pointer ${
              activeTab === "followers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Followers (0)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === "connections" ? (
          filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <div
              key={connection.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow space-y-3 sm:space-y-0"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={profileImages[connection.name]}
                    alt={connection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {connection.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{connection.title}</p>
                  <p className="text-xs text-gray-500 truncate">{connection.company}</p>
                  <p className="text-xs text-blue-600">
                    {connection.mutual} mutual connections
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(connection.id)}
                className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-full font-medium text-sm cursor-pointer ${
                  connection.isFollowing
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                {connection.isFollowing ? (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-xs" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))
          ) : searchQuery ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <FaUsers className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search. We couldn&apos;t find any connections
              matching &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <FaUsers className="inline-block text-4xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No connections yet
              </h3>
              <p className="text-gray-600">
                Start connecting with professionals in your field
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <FaUsers className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No followers yet
            </h3>
            <p className="text-gray-600">
              Share great content to attract followers to your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{
  profile: Profile;
  isEditingProfile: boolean;
  setIsEditingProfile: (value: boolean) => void;
  tempProfileName: string;
  setTempProfileName: (value: string) => void;
  tempProfileDescription: string;
  setTempProfileDescription: (value: string) => void;
  tempProfilePicture: string;
  handleEditProfile: () => void;
  handleProfilePictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleComingSoon: (feature: string) => void;
  isMobile?: boolean;
}> = ({
  profile,
  isEditingProfile,
  setIsEditingProfile,
  tempProfileName,
  setTempProfileName,
  tempProfileDescription,
  setTempProfileDescription,
  tempProfilePicture,
  handleEditProfile,
  handleProfilePictureUpload,
  handleComingSoon,
  isMobile,
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
      isMobile ? "mb-6" : ""
    }`}
  >
    {/* Blue header banner */}
    <div className="relative w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600"></div>
    
    {/* Profile content */}
    <div className="relative px-4 pb-4">
      {/* Profile picture overlapping the banner */}
      <div className="absolute -top-8 left-4 w-16 h-16 rounded-full bg-white border-4 border-white shadow-sm overflow-hidden">
        <img
          src={profile.picture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Profile info */}
      <div className="pt-10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {profile.name}
          </h2>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <FaEdit />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
          {profile.description}
        </p>
        
        <p className="text-sm text-gray-500 flex items-center mb-4">
          <FaGlobeAmericas className="mr-1 text-xs" />
          {profile.location}
        </p>
        
        {/* Connections and followers */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
            {profile.connections} connections
          </div>
          <div className="text-sm text-gray-600">
            {profile.followers} followers
          </div>
        </div>
      </div>
    </div>

    {!isMobile && (
      <>
        {/* Profile viewers section */}
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Profile viewers</span>
            <span className="text-sm font-bold text-blue-600">24</span>
          </div>
          <button
            onClick={() => handleComingSoon("Analytics")}
            className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
          >
            View all analytics
          </button>
        </div>

        {/* Premium section */}
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-700 font-medium mb-1">
            Grow your career with Premium
          </p>
          <button
            onClick={() => handleComingSoon("Premium")}
            className="text-yellow-600 text-sm font-medium hover:underline cursor-pointer"
          >
            Try Premium for ₹0
          </button>
        </div>

        {/* Bottom links */}
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          <button
            onClick={() => handleComingSoon("Saved items")}
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer w-full text-left"
          >
            <FaUser className="text-sm" />
            <span className="text-sm font-medium">Saved items</span>
          </button>
          <button
            onClick={() => handleComingSoon("Groups")}
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer w-full text-left"
          >
            <FaUsers className="text-sm" />
            <span className="text-sm font-medium">Groups</span>
          </button>
        </div>
      </>
    )}

    {isEditingProfile && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-auto my-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Edit Profile
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={tempProfilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="text-sm text-gray-500 cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={tempProfileName}
              onChange={(e) => setTempProfileName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
              style={{ color: "transparent", textShadow: "0 0 0 #000" }}
              autoComplete="off"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={tempProfileDescription}
              onChange={(e) => setTempProfileDescription(e.target.value)}
              placeholder="Describe yourself"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
              rows={3}
              style={{ color: "transparent", textShadow: "0 0 0 #000" }}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleEditProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const PostCard: React.FC<{
  post: Post;
  profile: Profile;
  profileImages: { [key: string]: string };
  connections: Connection[];
  handleLike: (postId: number) => void;
  handleCommentSubmit: (postId: number) => void;
  handleRepost: (postId: number) => void;
  handleShare: (postId: number) => void;
  handleFollow: (connectionId: number) => void;
  handleToggleComments: (postId: number) => void;
  handleLoadMoreComments: (postId: number) => void;
  visibleComments: { [key: number]: boolean };
  showAllComments: { [key: number]: boolean };
  newComment: { [key: number]: string };
  setNewComment: (value: { [key: number]: string }) => void;
}> = ({
  post,
  profile,
  profileImages,
  connections,
  handleLike,
  handleCommentSubmit,
  handleRepost,
  handleShare,
  handleFollow,
  handleToggleComments,
  handleLoadMoreComments,
  visibleComments,
  showAllComments,
  newComment,
  setNewComment,
}) => {
  const connection = connections.find((c) => c.name === post.author);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
          <img
            src={profileImages[post.author]}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              {/* Mobile layout - button next to name */}
              <div className="flex items-center space-x-2 mb-1 md:hidden">
                <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                  {post.author}
                </h3>
                {connection && (
                  <button
                    onClick={() => handleFollow(connection.id)}
                    className="flex items-center space-x-1 text-blue-600 border border-blue-600 rounded-full px-2 py-0.5 hover:bg-blue-50 transition-colors text-xs font-medium cursor-pointer"
                  >
                    {connection.isFollowing ? (
                      <>
                        <FaCheck className="text-xs" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="text-xs" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Desktop layout - name only */}
              <h3 className="hidden md:block text-base font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                {post.author}
              </h3>
              
              <p className="text-sm text-gray-600">{post.title}</p>
              {post.company && (
                <p className="text-sm text-gray-500">{post.company}</p>
              )}
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <span>{post.time}</span>
                <FaGlobeAmericas className="ml-1" />
              </p>
            </div>
            
            {/* Desktop layout - button in top right */}
            {connection && (
              <button
                onClick={() => handleFollow(connection.id)}
                className="hidden md:flex items-center space-x-1 text-blue-600 border border-blue-600 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
              >
                {connection.isFollowing ? (
                  <>
                    <FaCheck className="text-xs" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus className="text-xs" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
        {(post.image || post.video) && (
          <div className="mt-4 rounded-lg overflow-hidden">
            {post.image && (
              <img
                src={post.image}
                alt="Post Image"
                className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              />
            )}
            {post.video && (
              <video
                src={post.video}
                controls
                preload="metadata"
                className="w-full object-cover"
                style={{ backgroundColor: '#000' }}
              />
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
        <div className="flex items-center space-x-1">
          <FaThumbsUp className="text-blue-500" />
          <span>{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span 
            className="cursor-pointer hover:underline"
            onClick={() => handleToggleComments(post.id)}
          >
            {post.comments.length} comments
          </span>
          <span>•</span>
          <span className="cursor-pointer hover:underline">
            {post.reposts} reposts
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <button
          onClick={() => handleLike(post.id)}
          className={`flex flex-1 justify-center items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            post.liked
              ? "text-blue-600 bg-blue-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaThumbsUp />
          <span className="font-medium hidden xs:inline sm:inline">Like</span>
        </button>
        <button
          onClick={() => handleToggleComments(post.id)}
          className="flex flex-1 justify-center items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FaComment />
          <span className="font-medium hidden xs:inline sm:inline">
            Comment
          </span>
        </button>
        <button
          onClick={() => handleRepost(post.id)}
          className="flex flex-1 justify-center items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FaShare />
          <span className="font-medium hidden xs:inline sm:inline">Repost</span>
        </button>
        <button
          onClick={() => handleShare(post.id)}
          className="flex flex-1 justify-center items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <FaPaperPlane />
          <span className="font-medium hidden xs:inline sm:inline">Send</span>
        </button>
      </div>
      {visibleComments[post.id] && (
        <div className="mt-4 space-y-3">
          {(showAllComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={profileImages[comment.author]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {comment.author}
                  </p>
                  <span className="text-xs text-gray-400">{comment.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
              </div>
            </div>
          ))}
          {post.comments.length > 2 && (
            <button
              onClick={() => handleLoadMoreComments(post.id)}
              className="text-blue-600 text-sm hover:underline cursor-pointer ml-11"
            >
              {showAllComments[post.id] 
                ? `Show less` 
                : `Load more comments (${post.comments.length - 2} more)`
              }
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={profile.picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment[post.id] || ""}
                onChange={(e) =>
                  setNewComment({ ...newComment, [post.id]: e.target.value })
                }
                onKeyPress={(e) =>
                  e.key === "Enter" && handleCommentSubmit(post.id)
                }
                className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-800"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                disabled={!newComment[post.id]?.trim()}
                className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
                  newComment[post.id]?.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NewsSection: React.FC<{
  showMoreNews: boolean;
  setShowMoreNews: (value: boolean) => void;
}> = ({ showMoreNews, setShowMoreNews }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-900">LinkIn News</h2>
    <ul className="space-y-4">
      <a
        href="#"
        rel="noopener noreferrer"
        className="block"
      >
        <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <p className="text-sm font-semibold text-gray-900">
            Freshers&apos; guide: Mapping opportunities for &apos;22-&apos;24
            batch
          </p>
          <p className="text-xs text-gray-500 mt-1">7d ago • 12,940 readers</p>
        </li>
      </a>
      <a
        href="#"
        rel="noopener noreferrer"
        className="block"
      >
        <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <p className="text-sm font-semibold text-gray-900">
            Microsoft envisions AI-agent future
          </p>
          <p className="text-xs text-gray-500 mt-1">1h ago • 6,129 readers</p>
        </li>
      </a>
      <a
        href="#"
        rel="noopener noreferrer"
        className="block"
      >
        <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <p className="text-sm font-semibold text-gray-900">
            Demand surges for freelancers
          </p>
          <p className="text-xs text-gray-500 mt-1">6h ago • 1,599 readers</p>
        </li>
      </a>
      {showMoreNews && (
        <>
          <a
            href="#"
            rel="noopener noreferrer"
            className="block"
          >
            <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-gray-900">
                Affordable housing sales dip
              </p>
              <p className="text-xs text-gray-500 mt-1">
                23h ago • 1,004 readers
              </p>
            </li>
          </a>
          <a
            href="#"
            rel="noopener noreferrer"
            className="block"
          >
            <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-gray-900">
                Investors take a liking to deeptech
              </p>
              <p className="text-xs text-gray-500 mt-1">1d ago • 565 readers</p>
            </li>
          </a>
          <a
            href="#"
            rel="noopener noreferrer"
            className="block"
          >
            <li className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <p className="text-sm font-semibold text-gray-900">
                Tech layoffs continue in 2025
              </p>
              <p className="text-xs text-gray-500 mt-1">
                2d ago • 2,345 readers
              </p>
            </li>
          </a>
        </>
      )}
    </ul>
    <button
      onClick={() => setShowMoreNews(!showMoreNews)}
      className="mt-4 flex items-center space-x-1 text-blue-600 hover:underline text-sm cursor-pointer"
    >
      <span>{showMoreNews ? "Show less" : "Show more"}</span>
      {showMoreNews ? <FaAngleUp /> : <FaAngleDown />}
    </button>
  </div>
);

const LinkedInClone: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "Liyana",
    description:
      "Frontend Developer | React, TypeScript, Next.js",
    location: "Hyderabad, Telangana, India",
    picture:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format",
    connections: 847,
    followers: 1234,
  });

  const [activePage, setActivePage] = useState<
    "feed" | "network" | "jobs" | "messaging" | "notifications"
  >("feed");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(profile.name);
  const [tempProfileDescription, setTempProfileDescription] = useState(
    profile.description
  );
  const [tempProfilePicture, setTempProfilePicture] = useState(profile.picture);

  const defaultPosts: Post[] = [
    {
      id: 1,
      author: "Vikas Singh",
      title: "AI & Tech Content Creator | Personal Branding Specialist",
      company: "Microsoft",
      content:
        '🚀 ChatGPT Can Get You Hired Faster Than Any Recruiter\n\nCopy these seven prompts to land your dream job:\n\n1. "Help me tailor my resume for [specific role] at [company]"\n2. "Create a compelling cover letter for [position]"\n3. "Prepare me for common interview questions in [industry]"\n\nThe future of job hunting is here. Are you ready? 💼\n\n#AI #JobSearch #CareerTips #ChatGPT',
      time: "3h",
      likes: 2782,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Sarah Johnson",
          text: "This is incredibly helpful! Thanks for sharing.",
          time: "2h",
        },
        {
          id: 2,
          author: "Mike Chen",
          text: "AI is definitely changing how we approach job applications.",
          time: "1h",
        },
      ],
      reposts: 502,
      shares: 156,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 2,
      author: "Harish Kumar",
      title: "LinkedIn Growth Expert | Helping Professionals Build Their Brand",
      company: "Google",
      content:
        "5 Tips to Boost Your LinkedIn Profile Visibility! 🚀\n\n✅ Use industry-specific keywords\n✅ Post consistently (3-5 times per week)\n✅ Engage meaningfully with others' content\n✅ Share your expertise through articles\n✅ Optimize your headline for search\n\nConsistency is key to building your professional brand online.\n\n#LinkedInTips #PersonalBranding #ProfessionalGrowth",
      time: "1d",
      likes: 1450,
      liked: true,
      comments: [
        {
          id: 1,
          author: "Lisa Wang",
          text: "Great insights! The keyword tip especially helped me.",
          time: "12h",
        },
      ],
      reposts: 320,
      shares: 89,
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 3,
      author: "Anjali Sharma",
      title: "Senior Data Scientist | ML Engineer",
      company: "IBM",
      content:
        "Excited to share my latest project on predictive analytics! 📊\n\nBuilt a machine learning model that predicts customer churn with 94% accuracy using:\n\n🔹 Python & Scikit-learn\n🔹 Feature engineering techniques\n🔹 Ensemble methods (Random Forest + XGBoost)\n🔹 Cross-validation for robust results\n\nData science is all about turning numbers into actionable insights!\n\n#DataScience #MachineLearning #Python #Analytics",
      time: "2h",
      likes: 856,
      liked: false,
      comments: [
        {
          id: 1,
          author: "David Rodriguez",
          text: "Impressive accuracy! What features were most predictive?",
          time: "1h",
        },
        {
          id: 2,
          author: "Emily Foster",
          text: "Would love to see a breakdown of your methodology.",
          time: "30m",
        },
      ],
      reposts: 145,
      shares: 67,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 4,
      author: "Priya Patel",
      title: "UX/UI Designer | Design Systems Advocate",
      company: "Adobe",
      content:
        "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs\n\nJust completed a major redesign of our mobile app that increased user engagement by 40%! 🎨\n\nKey improvements:\n• Simplified navigation flow\n• Enhanced accessibility features\n• Consistent design language\n• User-centered approach\n\nGreat design starts with understanding your users deeply.\n\n#UXDesign #ProductDesign #UserExperience #DesignThinking",
      time: "5h",
      likes: 1234,
      liked: false,
      comments: [],
      reposts: 234,
      shares: 78,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 5,
      author: "Rohit Sharma",
      title: "Full Stack Developer | React & Node.js Specialist",
      company: "Amazon",
      content:
        "🔥 Just deployed my side project to production!\n\nBuilt a real-time collaboration tool using:\n\n⚡ React with TypeScript\n⚡ Node.js & Express\n⚡ Socket.io for real-time features\n⚡ MongoDB for data persistence\n⚡ AWS for hosting\n\nNothing beats the feeling of seeing your code come to life! The learning never stops in tech.\n\n#WebDevelopment #React #NodeJS #FullStack #SideProject",
      time: "6h",
      likes: 678,
      liked: true,
      comments: [
        {
          id: 1,
          author: "Alex Thompson",
          text: "Congrats! Would love to check it out.",
          time: "3h",
        },
      ],
      reposts: 89,
      shares: 45,
    },
    {
      id: 6,
      author: "Neha Gupta",
      title: "Product Manager | SaaS Expert",
      company: "Slack",
      content:
        "Product Management Lesson of the Day 💡\n\nFeatures don't make products successful. Solutions to real problems do.\n\nBefore building anything, ask:\n✓ What problem does this solve?\n✓ Who has this problem?\n✓ How do they solve it today?\n✓ Why is our solution better?\n\nCustomer research > Feature requests\n\n#ProductManagement #SaaS #CustomerResearch #ProductStrategy",
      time: "8h",
      likes: 2456,
      liked: false,
      comments: [
        {
          id: 1,
          author: "Kevin Liu",
          text: "This is exactly what I needed to hear today!",
          time: "5h",
        },
        {
          id: 2,
          author: "Rachel Green",
          text: "Customer research is indeed the foundation of great products.",
          time: "4h",
        },
      ],
      reposts: 456,
      shares: 123,
    },
  ];

  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 1,
      name: "Vikas Singh",
      title: "AI & Tech Content Creator",
      company: "Microsoft",
      mutual: 15,
      isConnected: false,
      isFollowing: false,
    },
    {
      id: 2,
      name: "Harish Kumar",
      title: "LinkedIn Growth Expert",
      company: "Google",
      mutual: 23,
      isConnected: true,
      isFollowing: false,
    },
    {
      id: 3,
      name: "Anjali Sharma",
      title: "Senior Data Scientist",
      company: "IBM",
      mutual: 8,
      isConnected: false,
      isFollowing: false,
    },
    {
      id: 4,
      name: "Priya Patel",
      title: "UX/UI Designer",
      company: "Adobe",
      mutual: 12,
      isConnected: false,
      isFollowing: true,
    },
    {
      id: 5,
      name: "Rohit Sharma",
      title: "Full Stack Developer",
      company: "Amazon",
      mutual: 34,
      isConnected: true,
      isFollowing: false,
    },
    {
      id: 6,
      name: "Neha Gupta",
      title: "Product Manager",
      company: "Slack",
      mutual: 19,
      isConnected: false,
      isFollowing: false,
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostVideo, setNewPostVideo] = useState<string | null>(null);

  const [showMoreNews, setShowMoreNews] = useState(false);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [visibleComments, setVisibleComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [showAllComments, setShowAllComments] = useState<{
    [key: number]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts([{ id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handlePostSubmit = () => {
    if (!newPost.trim() && !newPostImage && !newPostVideo) {
      addToast("Please write something or add media to post", "error");
      return;
    }
    const newPostObj: Post = {
      id: posts.length + 1,
      author: profile.name,
      title: "Frontend Developer | React Specialist",
      company: "Tech Solutions",
      content: newPost,
      time: "Just now",
      likes: 0,
      liked: false,
      comments: [],
      reposts: 0,
      shares: 0,
      image: newPostImage || undefined,
      video: newPostVideo || undefined,
    };
    setPosts([newPostObj, ...posts]);
    setNewPost("");
    setNewPostImage(null);
    // Clean up video URL if it exists
    if (newPostVideo) {
      URL.revokeObjectURL(newPostVideo);
    }
    setNewPostVideo(null);
    addToast("Post shared successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("Image size should be less than 5MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
        addToast("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        addToast("Video size should be less than 50MB", "error");
        return;
      }
      // Clean up previous video URL if it exists
      if (newPostVideo) {
        URL.revokeObjectURL(newPostVideo);
      }
      // Create object URL for video
      const videoUrl = URL.createObjectURL(file);
      setNewPostVideo(videoUrl);
      addToast("Video uploaded successfully!");
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiking = !post.liked;
          if (isLiking) {
            addToast("Post liked!");
          }
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleCommentSubmit = (postId: number) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) {
      addToast("Please write a comment", "error");
      return;
    }
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                author: profile.name,
                text: commentText,
                time: "Just now",
              },
            ],
          };
        }
        return post;
      })
    );
    setNewComment({ ...newComment, [postId]: "" });
    addToast("Comment added successfully!");
  };

  const handleRepost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, reposts: post.reposts + 1 };
        }
        return post;
      })
    );
    addToast("Post reposted!");
  };

  const handleShare = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, shares: post.shares + 1 };
        }
        return post;
      })
    );
    addToast("Post shared!");
  };

  const handleToggleComments = (postId: number) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLoadMoreComments = (postId: number) => {
    setShowAllComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComingSoon = (feature: string) => {
    addToast(`${feature} feature coming soon!`);
  };

  const handleFollow = (connectionId: number) => {
    setConnections(
      connections.map((connection) => {
        if (connection.id === connectionId) {
          const isFollowing = !connection.isFollowing;
          if (isFollowing) {
            addToast(`Now following ${connection.name}!`);
          } else {
            addToast(`Unfollowed ${connection.name}`);
          }
          return { ...connection, isFollowing: !connection.isFollowing };
        }
        return connection;
      })
    );
  };

  const handleEditProfile = () => {
    if (!tempProfileName.trim()) {
      addToast("Name cannot be empty", "error");
      return;
    }
    setProfile({
      ...profile,
      name: tempProfileName,
      description: tempProfileDescription,
      picture: tempProfilePicture,
    });
    setIsEditingProfile(false);
    addToast("Profile updated successfully!");
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast("Profile picture size should be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => b.id - a.id);

  const profileImages: { [key: string]: string } = {
    Liyana:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format",
    "Vikas Singh":
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format",
    "Harish Kumar":
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&auto=format",
    "Anjali Sharma":
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format",
    "Priya Patel":
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format",
    "Rohit Sharma":
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
    "Neha Gupta":
      "https://images.unsplash.com/photo-1445053023192-8d45cb66099d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww",
    "Sarah Johnson":
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format",
    "Mike Chen":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    "Lisa Wang":
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&auto=format",
    "David Rodriguez":
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&auto=format",
    "Emily Foster":
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&auto=format",
    "Alex Thompson":
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&auto=format",
    "Kevin Liu":
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&auto=format",
    "Rachel Green":
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&auto=format",
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (isEditingProfile || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditingProfile, isMobileMenuOpen]);

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-full xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
              <FaLinkedin className="text-blue-600 text-3xl cursor-pointer flex-shrink-0" />
              {activePage === "feed" && (
                <div className="relative flex-1 md:w-auto md:block">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 pl-10 rounded-md bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-800"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <div className="hidden md:flex space-x-6 items-center">
                <button
                  onClick={() => setActivePage("feed")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <FaHome className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">Home</span>
                </button>
                <button
                  onClick={() => setActivePage("network")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <FaUsers className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">My Network</span>
                </button>
                <button
                  onClick={() => handleComingSoon("Jobs")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <FaBriefcase className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">Jobs</span>
                </button>
                <button
                  onClick={() => handleComingSoon("Messaging")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <FaEnvelope className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">Messaging</span>
                </button>
                <button
                  onClick={() => handleComingSoon("Notifications")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <FaBell className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">Notifications</span>
                </button>
                <button
                  onClick={() => handleComingSoon("Profile")}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                >
                  <div className="h-6 flex items-center justify-center mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={profile.picture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  </div>
                  <span className="text-xs font-medium">Me</span>
                </button>
                <div className="border-l border-gray-300 pl-4 h-12 flex items-center">
                  <button
                    className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-h-[48px]"
                    onClick={() => handleComingSoon("For Business")}
                  >
                    <div className="h-6 flex items-center justify-center mb-1">
                      <FaBriefcase className="text-xl" />
                    </div>
                    <span className="text-xs font-medium">For Business</span>
                  </button>
                </div>
                <div className="flex items-center h-12">
                <button
                  className="text-yellow-600 text-xs font-medium hover:underline cursor-pointer"
                  onClick={() => handleComingSoon("Premium")}
                >
                  Try Premium for ₹0
                </button>
                </div>
              </div>

              {/* Mobile hamburger menu */}
              <div className="flex md:hidden items-center space-x-3 ml-2">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                  aria-label="Menu"
                >
                  <FaBars className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              backdropFilter: 'blur(20px) brightness(0.7)',
              WebkitBackdropFilter: 'blur(20px) brightness(0.7)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          ></div>
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 bg-white w-64 h-full shadow-xl animate-in slide-in-from-right duration-300 ease-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={profile.picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600">View profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="py-4">
              <button
                onClick={() => {
                  setActivePage("feed");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                  activePage === "feed" ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                }`}
              >
                <FaHome className="text-xl" />
                <span className="font-medium">Home</span>
              </button>
              
              <button
                onClick={() => {
                  setActivePage("network");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                  activePage === "network" ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-700"
                }`}
              >
                <FaUsers className="text-xl" />
                <span className="font-medium">My Network</span>
              </button>
              
              <button
                onClick={() => {
                  handleComingSoon("Jobs");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
              >
                <FaBriefcase className="text-xl" />
                <span className="font-medium">Jobs</span>
              </button>
              
              <button
                onClick={() => {
                  handleComingSoon("Messaging");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
              >
                <FaEnvelope className="text-xl" />
                <span className="font-medium">Messaging</span>
              </button>
              
              <button
                onClick={() => {
                  handleComingSoon("Notifications");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
              >
                <FaBell className="text-xl" />
                <span className="font-medium">Notifications</span>
              </button>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button
                  onClick={() => {
                    handleComingSoon("Profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                >
                  <FaUser className="text-xl" />
                  <span className="font-medium">Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    handleComingSoon("Settings");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                >
                  <span className="font-medium text-sm">Settings & Privacy</span>
                </button>
                
                <button
                  onClick={() => {
                    handleComingSoon("Premium");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-yellow-600 cursor-pointer"
                >
                  <span className="font-medium text-sm">Try Premium for ₹0</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePage === "network" ? (
        // Network page - full screen width
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <NetworkPage
            connections={connections}
            handleFollow={handleFollow}
            profileImages={profileImages}
          />
        </main>
      ) : (
        // Feed page - constrained width with sidebars
        <main className="flex-1 max-w-full xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Feed page - with sidebar layout */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {!searchQuery.trim() && (
              <aside className="hidden md:block w-full md:w-1/6 lg:w-1/5">
                <ProfileCard
                  profile={profile}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  tempProfileName={tempProfileName}
                  setTempProfileName={setTempProfileName}
                  tempProfileDescription={tempProfileDescription}
                  setTempProfileDescription={setTempProfileDescription}
                  tempProfilePicture={tempProfilePicture}
                  handleEditProfile={handleEditProfile}
                  handleProfilePictureUpload={handleProfilePictureUpload}
                  handleComingSoon={handleComingSoon}
                />
              </aside>
            )}

            <section className={`w-full ${searchQuery.trim() ? "md:w-full" : "md:w-4/6 lg:w-3/5"}`}>
            {activePage === "feed" && !searchQuery.trim() && (
              <div className="md:hidden">
                <ProfileCard
                  profile={profile}
                  isEditingProfile={isEditingProfile}
                  setIsEditingProfile={setIsEditingProfile}
                  tempProfileName={tempProfileName}
                  setTempProfileName={setTempProfileName}
                  tempProfileDescription={tempProfileDescription}
                  setTempProfileDescription={setTempProfileDescription}
                  tempProfilePicture={tempProfilePicture}
                  handleEditProfile={handleEditProfile}
                  handleProfilePictureUpload={handleProfilePictureUpload}
                  handleComingSoon={handleComingSoon}
                  isMobile={true}
                />
              </div>
            )}

            {activePage === "feed" ? (
              <>
                {!searchQuery.trim() && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={profile.picture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Start a post"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handlePostSubmit()
                      }
                      className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-800"
                    />
                  </div>
                  {(newPostImage || newPostVideo) && (
                    <div className="mb-4 relative">
                      {newPostImage && (
                        <div className="relative">
                          <img
                            src={newPostImage}
                            alt="Post Preview"
                            className="w-full rounded-lg max-h-64 object-cover"
                          />
                          <button
                            onClick={() => setNewPostImage(null)}
                            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-all cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                      {newPostVideo && (
                        <div className="relative">
                          <video
                            src={newPostVideo}
                            controls
                            preload="metadata"
                            className="w-full rounded-lg max-h-64"
                            style={{ backgroundColor: '#000' }}
                          />
                          <button
                            onClick={() => {
                              if (newPostVideo) {
                                URL.revokeObjectURL(newPostVideo);
                              }
                              setNewPostVideo(null);
                            }}
                            className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-all cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaImage className="text-blue-500" />
                        <span className="text-sm font-medium">Media</span>
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <FaVideo className="text-green-500" />
                        <span className="text-sm font-medium">Video</span>
                      </button>
                      <input
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                    {(newPost.trim() || newPostImage || newPostVideo) && (
                      <button
                        onClick={handlePostSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Post
                      </button>
                    )}
                  </div>
                </div>
                )}

                {!searchQuery.trim() && (
                  <div className="h-px bg-gray-300 mb-6"></div>
                )}

                {sortedPosts.length > 0 ? (
                  sortedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    profile={profile}
                    profileImages={profileImages}
                    connections={connections}
                    handleLike={handleLike}
                    handleCommentSubmit={handleCommentSubmit}
                    handleRepost={handleRepost}
                    handleShare={handleShare}
                    handleFollow={handleFollow}
                    handleToggleComments={handleToggleComments}
                      handleLoadMoreComments={handleLoadMoreComments}
                    visibleComments={visibleComments}
                      showAllComments={showAllComments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                  />
                  ))
                ) : searchQuery.trim() ? (
                  <div className="bg-gray-50 rounded-2xl p-12 mb-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaSearch className="text-gray-500 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No results found
                    </h3>
                    <p className="text-gray-600 text-lg mb-2 max-w-md mx-auto">
                      No posts found for <span className="font-semibold text-gray-800">&quot;{searchQuery}&quot;</span>
                    </p>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                      Try searching for different keywords or check the spelling
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 cursor-pointer transform hover:scale-105"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-12 mb-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaUsers className="text-gray-500 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto">
                      Start sharing your thoughts and connect with your network!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <NetworkPage
                connections={connections}
                handleFollow={handleFollow}
                profileImages={profileImages}
              />
            )}
            </section>

            {activePage === "feed" && !searchQuery.trim() && (
              <aside className="hidden md:block w-full md:w-1/6 lg:w-1/5">
                <NewsSection
                  showMoreNews={showMoreNews}
                  setShowMoreNews={setShowMoreNews}
                />
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    Today&apos;s puzzle
                  </h2>
                  <a
                    href="#"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <FaPuzzlePiece className="text-orange-500 text-2xl" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Zip - a quick brain teaser
                        </p>
                        <p className="text-xs text-gray-500">
                          Solve in 60s or less!
                        </p>
                      </div>
                    </div>
                  </a>
                  <p className="text-xs text-gray-500 mt-3">
                    Score is private to you
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaAd className="text-gray-400 text-xl" />
                      <p className="text-sm text-gray-500">Promoted</p>
                    </div>
                  </div>
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      Boost your career with LinkedIn Premium
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Get insights on who viewed your profile
                    </p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </main>
        )
        }

      <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center mt-auto">
        <p className="text-sm text-gray-600">© 2024 LinkIn. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LinkedInClone;