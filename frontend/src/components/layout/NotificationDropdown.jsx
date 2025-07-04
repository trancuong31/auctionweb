// src/components/ui/NotificationDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../services/axiosClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const NotificationDropdown = ({ triggerRef }) => {
  const dropdownRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      axiosClient.get("/notifications")
        .then((res) => setNotifications(res.data || []))
        .catch(() => setNotifications([]));
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  return (
    <span style={{ position: "relative", display: "inline-block" }} ref={triggerRef}>
      <FontAwesomeIcon
        icon={faBell}
        className="bell-icon"
        style={{ marginLeft: "10px", cursor: "pointer" }}
        onClick={() => setVisible((v) => !v)}
      />
      {visible && (
        <div className="notification-dropdown" ref={dropdownRef}>
          <div className="notification-dropdown-header">
            <FontAwesomeIcon icon={faBell} style={{ marginRight: "8px" }} />
            Thông báo
          </div>
          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li className="notification-item">Chưa có thông báo nào.</li>
            ) : (
              notifications.map((item) => (
                <li
                  className={`notification-item${item.is_read ? "" : " unread"}`}
                  key={item.id}
                  title={item.message}
                >
                  <span className="notification-avatar"><FontAwesomeIcon icon={faUser} /></span>
                  <span style={{ flex: 1, minWidth: 0, borderBottom: "1px solid" }}>
                    {/* {!item.is_read && (
                      <span className="dot-unread" title="Chưa đọc"></span>
                    )} */}
                    <span
                      className="notification-message"
                      style={{
                        fontWeight: item.is_read ? "normal" : "bold",
                      }}
                    >
                      {item.message.length > 60
                        ? item.message.slice(0, 60) + "..."
                        : item.message}
                    </span>
                    <br />
                    <span className="notification-time">
                      {dayjs(item.created_at).fromNow()}
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>
          {/* <div className="notification-dropdown-footer">Thu gọn</div> */}
        </div>
      )}
    </span>
  );
};

export default NotificationDropdown;
