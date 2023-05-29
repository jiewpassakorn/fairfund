import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { CustomButton } from ".";
import { logo, menu, search, thirdweb, fairfund } from "../assets";
import { navlinks } from "../constants";
import { useDisconnect } from "@thirdweb-dev/react";
import "./CustomButton.css";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

const NavbarV2 = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();
  const disconnect = useDisconnect();

  return (
    <nav className="bg-white bg-transparent dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <img src={fairfund} className="h-8 mr-3" alt="" />
          <span className="self-center text-2xl font-epilogue font-bold whitespace-nowrap dark:text-white">
            FairFund
          </span>
        </Link>
        <div className="flex md:order-2 ">
          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "Disconnect" : "Connect"}
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={() => {
                if (address) disconnect();
                else connect();
              }}
            />
          </div>
          <img
            src={menu}
            alt="menu"
            className="w-[52px] h-[52px] object-contain cursor-pointer inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />
        </div>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky">
          <ul className="flex flex-row ">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-3 ${
                  isActive === link.name && "bg-[#3a3a43]"
                } rounded-[10px] cursor-pointer`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}>
                <div className="flex items-center justify-center">
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[20px] h-[20px] ${
                      isActive === link.name ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <p
                    className={`mt-[2px] ml-[8px] font-epilogue font-semibold text-[14px] ${
                      isActive === link.name
                        ? "text-[#1dc071]"
                        : "text-[#808191]"
                    }`}>
                    {link.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-2  ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-[4vh]"
          } transition-all duration-700 rounded-[20px] md:hidden`}>
          <ul className="mb-4 ">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}>
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarV2;
