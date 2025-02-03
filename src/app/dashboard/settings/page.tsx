"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    applicationUpdates: true,
  });

  const handleNotificationChange = (setting: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium text-gray-900 dark:text-white">Settings</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Information</h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user?.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {user?.primaryEmailAddress?.emailAddress}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Settings</h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email"
                  name="email"
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange("email")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications about your account activity.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="jobAlerts"
                  name="jobAlerts"
                  type="checkbox"
                  checked={notifications.jobAlerts}
                  onChange={() => handleNotificationChange("jobAlerts")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="jobAlerts" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Alerts
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when new jobs matching your preferences are posted.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="applicationUpdates"
                  name="applicationUpdates"
                  type="checkbox"
                  checked={notifications.applicationUpdates}
                  onChange={() => handleNotificationChange("applicationUpdates")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="applicationUpdates" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Application Updates
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive updates about your job applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 