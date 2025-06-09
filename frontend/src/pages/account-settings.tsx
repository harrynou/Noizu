import { useState } from "react";

const AccountSettingsPage = (): JSX.Element => {
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <div className="px-6 my-6">
        <h1 className="text-3xl text-secondary font-bold">Settings</h1>
      </div>
      {/* Tab Options */}
      <div className="flex px-4 gap-4">
        <button
          className={`flex flex-col py-3 px-6
          ${
            tab === 0
              ? "text-white border-b-2 border-accentPrimary"
              : "text-gray-300 hover:text-white hover:border-b-2 hover:border-accentPrimary"
          } transition-colors`}
          onClick={() => {
            setTab(0);
          }}>
          <h2>Personal Info</h2>
        </button>
        <button
          className={`flex flex-col py-3 px-6
          ${
            tab === 1
              ? "text-white border-b-2 border-accentPrimary"
              : "text-gray-300 hover:text-white hover:border-b-2 hover:border-accentPrimary"
          } transition-colors`}
          onClick={() => {
            setTab(1);
          }}>
          <h2>Connections</h2>
        </button>
      </div>
      <hr className="mx-4"></hr>
    </div>
  );
};

export default AccountSettingsPage;
