import AnimatedContent from "../ui/animatedContent";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function History() {
  const { t, i18n } = useTranslation();
  // Khi load trang, ưu tiên lấy ngôn ngữ từ sessionStorage nếu có
  useEffect(() => {
    const savedLang = sessionStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  const scopeList = t("history_scope_list", { returnObjects: true });
  const contributionList = t("history_contribution_list", {
    returnObjects: true,
  });
  return (
    <AnimatedContent>
      <main className="history-content ">
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "1200px",
            margin: "40px auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.30)",
          }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              marginBottom: "32px",
              color: "#2d3748",
              letterSpacing: "1px",
              textAlign: "center",
            }}
          >
            {t("history_title")}
          </h2>
          <div style={{ fontSize: "18px", color: "#222", lineHeight: "2" }}>
            <div
              style={{
                borderLeft: "4px solid #667eea",
                paddingLeft: "24px",
                marginBottom: "24px",
                background: "linear-gradient(90deg, #f6f8fa 80%, transparent)",
                borderRadius: "6px",
              }}
            >
              {[2008, 2015, 2024].map((year) => (
                <div key={year}>
                  <strong>{t(`history_milestone_${year}_title`)}:</strong>{" "}
                  {t(`history_milestone_${year}_desc`)}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "24px" }}>
              <strong>{t("history_scope_title")}:</strong>
              <ul style={{ margin: "8px 0 0 24px", padding: 0 }}>
                {scopeList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <span>{t("history_scope_desc")}</span>
            </div>
            <div>
              <strong>{t("history_contribution_title")}:</strong>
              <ul style={{ margin: "8px 0 0 24px", padding: 0 }}>
                {contributionList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </AnimatedContent>
  );
}

export default History;
