import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const initialContent = {
  hero_name: "Kim Yeo-eun",
  hero_title: "Field Service Engineer Candidate",
  hero_subtitle: "Ship Operation Experience & Equipment Troubleshooting",
  hero_intro: "선박 운항 경험을 바탕으로 장비의 운용 원리와 현장 문제 해결 능력을 갖춘 엔지니어 김여은입니다.",
  about_background: "한국해양대학교 해사글로벌학부 / 선박 승선 경험 (3rd Officer)",
  about_why: "장비를 직접 운용하며 설치 상태와 작동 원리에 관심이 생겼으며, 단순 사용자가 아닌 장비 이해와 문제 해결 역할로 확장하고자 합니다.",
  about_strengths: "현장 환경 적응력, 장비 운용 경험, 기술 문서 이해",
  experience_json: JSON.stringify([
    {
      company: "KIOST (한국해양과학기술원)",
      role: "Research Assistant",
      period: "2024.02 - 2024.07",
      tasks: ["연구 데이터 정리", "실험 데이터 관리", "연구 지원"],
      tech: ["데이터 분석", "연구 장비 관리"],
      learning: "정밀한 데이터 관리의 중요성 습득"
    },
    {
      company: "Estora Shipping",
      role: "Third Officer",
      period: "2024.10 - 2025.04",
      tasks: ["Radar, ECDIS 운용", "항해 장비 모니터링", "선박 운항 지원"],
      tech: ["항해 장비 상태 점검", "운용 중 이상 상황 대응", "장비 작동 원리 이해"],
      learning: "장비는 단순 사용이 아니라 시스템 단위로 이해해야 한다"
    }
  ]),
  skills_json: JSON.stringify({
    marine: ["Radar", "ECDIS", "Navigation Equipment", "Telegraph System", "Anemometer"],
    tools: ["MS Office", "Technical Documentation", "Data Analysis"]
  }),
  cases_json: JSON.stringify([
    {
      title: "Navigation Equipment Monitoring",
      situation: "항해 중 장비 상태를 지속적으로 모니터링해야 하는 환경",
      action: "장비 상태 점검, 이상 상황 확인, 운항 안전 확보",
      result: "장비 신뢰성 확보, 장비 관리 중요성 이해"
    },
    {
      title: "Equipment Alarm 대응 경험",
      situation: "항해 중 장비 모니터링 과정에서 알람이 발생하거나 장비 상태 값이 평소와 다르게 나타나는 상황이 발생할 수 있다.",
      action: "장비 표시 값 및 상태 메시지 확인, 장비 매뉴얼 및 브리지 시스템을 통해 원인 가능성 검토, 필요 시 선내 담당자와 상황 공유 후 상태 지속 모니터링",
      result: "장비 상태를 신속히 파악하여 운항 중 장비 신뢰성 유지, 장비 알람 대응 절차와 시스템 확인 프로세스의 중요성 이해"
    },
    {
      title: "항해 장비 운용 및 시스템 이해",
      situation: "선박 운항 시 레이더, ECDIS 등 여러 항해 장비를 동시에 운용해야 하며 각 장비의 정보가 운항 판단에 직접적인 영향을 준다.",
      action: "장비별 기능과 표시 정보 확인, 장비 간 정보 연계 방식 이해, 운항 중 장비 상태 및 정보 정확성 지속 확인",
      result: "여러 장비의 데이터를 기반으로 운항 상황을 종합적으로 판단하는 능력 향상, 장비는 단순 사용이 아니라 시스템 관점에서 이해해야 한다는 인식 형성"
    }
  ]),
  activities_json: JSON.stringify([
    { name: "대학생 진로 멘토단 (영도구청)", focus: "커뮤니케이션 능력" },
    { name: "학습 서포터즈 (한국해양대학교)", focus: "협업 경험" },
    { name: "입학홍보대사 ‘아라미’ (한국해양대학교)", focus: "대외 커뮤니케이션 능력과 책임감 강화" },
    { name: "연의사관부 간부 (한국해양대학교)", focus: "리더십과 조직 운영 경험 축적" },
    { name: "배사관부 위생사관 (한나라호)", focus: "구성원 간 조율과 소통 능력 강화" },
    { name: "학교홍보대사 ‘사랑해’ (한국해양대학교)", focus: "대외 소통 및 대응 역량 강화" },
    { name: "봉사활동 (다양한 봉사기관)", focus: "지역사회 기여 및 200시간 이상의 봉사 수행" }
  ]),
  education_json: JSON.stringify([
    { school: "와부고등학교", degree: "졸업", status: "" },
    { school: "한국해양대학교", degree: "해사글로벌학부", status: "졸업" }
  ]),
  certs_json: JSON.stringify([
    "3급항해사 면허", "2급항해사 면허", "전파전자급3급통신사", "TOEIC SPEAKING IM3", "워드프로세서 1급"
  ]),
  contact_email: "labiancaneve23@gmail.com",
  learning_log_json: JSON.stringify([
    { title: "Marine Radar System", content: "Pulse compression and signal processing basics" },
    { title: "ECDIS System", content: "ENC data management and route planning" },
    { title: "AIS (Automatic Identification System)", content: "Vessel tracking protocols and dynamic data exchange" },
    { title: "GPS & GNSS Navigation System", content: "Satellite signal processing and positioning accuracy" },
    { title: "Gyro Compass System", content: "Heading reference stability and inertial navigation" },
    { title: "Echo Sounder", content: "Acoustic signal propagation and depth measurement principles" }
  ]),
  profile_image: "",
  resume_file: "",
  resume_filename: ""
};

const insert = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
for (const [key, value] of Object.entries(initialContent)) {
  insert.run(key, value);
}

// Ensure the name is updated if it was previously set incorrectly
db.prepare("UPDATE content SET value = 'Kim Yeo-eun' WHERE key = 'hero_name' AND value = 'Kim Ye-eun'").run();

const newExperienceJson = JSON.stringify([
  {
    company: "KIOST (한국해양과학기술원)",
    role: "Research Assistant",
    period: "2024.02 - 2024.07",
    tasks: ["연구 데이터 정리", "실험 데이터 관리", "연구 지원"],
    tech: ["데이터 분석", "연구 장비 관리"],
    learning: "정밀한 데이터 관리의 중요성 습득"
  },
  {
    company: "Estora Shipping",
    role: "Third Officer",
    period: "2024.10 - 2025.04",
    tasks: ["Radar, ECDIS 운용", "항해 장비 모니터링", "선박 운항 지원"],
    tech: ["항해 장비 상태 점검", "운용 중 이상 상황 대응", "장비 작동 원리 이해"],
    learning: "장비는 단순 사용이 아니라 시스템 단위로 이해해야 한다"
  }
]);
const newSkillsJson = JSON.stringify({
  marine: ["Radar", "ECDIS", "Navigation Equipment", "Telegraph System", "Anemometer"],
  tools: ["MS Office", "Technical Documentation", "Data Analysis"]
});
const newCasesJson = JSON.stringify([
  {
    title: "Navigation Equipment Monitoring",
    situation: "항해 중 장비 상태를 지속적으로 모니터링해야 하는 환경",
    action: "장비 상태 점검, 이상 상황 확인, 운항 안전 확보",
    result: "장비 신뢰성 확보, 장비 관리 중요성 이해"
  },
  {
    title: "Equipment Alarm 대응 경험",
    situation: "항해 중 장비 모니터링 과정에서 알람이 발생하거나 장비 상태 값이 평소와 다르게 나타나는 상황이 발생할 수 있다.",
    action: "장비 표시 값 및 상태 메시지 확인, 장비 매뉴얼 및 브리지 시스템을 통해 원인 가능성 검토, 필요 시 선내 담당자와 상황 공유 후 상태 지속 모니터링",
    result: "장비 상태를 신속히 파악하여 운항 중 장비 신뢰성 유지, 장비 알람 대응 절차와 시스템 확인 프로세스의 중요성 이해"
  },
  {
    title: "항해 장비 운용 및 시스템 이해",
    situation: "선박 운항 시 레이더, ECDIS 등 여러 항해 장비를 동시에 운용해야 하며 각 장비의 정보가 운항 판단에 직접적인 영향을 준다.",
    action: "장비별 기능과 표시 정보 확인, 장비 간 정보 연계 방식 이해, 운항 중 장비 상태 및 정보 정확성 지속 확인",
    result: "여러 장비의 데이터를 기반으로 운항 상황을 종합적으로 판단하는 능력 향상, 장비는 단순 사용이 아니라 시스템 관점에서 이해해야 한다는 인식 형성"
  }
]);
const newLearningLogJson = JSON.stringify([
  { title: "Marine Radar System", content: "Pulse compression and signal processing basics" },
  { title: "ECDIS System", content: "ENC data management and route planning" },
  { title: "AIS (Automatic Identification System)", content: "Vessel tracking protocols and dynamic data exchange" },
  { title: "GPS & GNSS Navigation System", content: "Satellite signal processing and positioning accuracy" },
  { title: "Gyro Compass System", content: "Heading reference stability and inertial navigation" },
  { title: "Echo Sounder", content: "Acoustic signal propagation and depth measurement principles" }
]);
db.prepare("UPDATE content SET value = ? WHERE key = 'learning_log_json'").run(newLearningLogJson);

const newActivitiesJson = JSON.stringify([
  { name: "대학생 진로 멘토단 (영도구청)", focus: "커뮤니케이션 능력" },
  { name: "학습 서포터즈 (한국해양대학교)", focus: "협업 경험" },
  { name: "입학홍보대사 ‘아라미’ (한국해양대학교)", focus: "대외 커뮤니케이션 능력과 책임감 강화" },
  { name: "연의사관부 간부 (한국해양대학교)", focus: "리더십과 조직 운영 경험 축적" },
  { name: "배사관부 위생사관 (한나라호)", focus: "구성원 간 조율과 소통 능력 강화" },
  { name: "학교홍보대사 ‘사랑해’ (한국해양대학교)", focus: "대외 소통 및 대응 역량 강화" },
  { name: "봉사활동 (다양한 봉사기관)", focus: "지역사회 기여 및 200시간 이상의 봉사 수행" }
]);
db.prepare("UPDATE content SET value = ? WHERE key = 'activities_json'").run(newActivitiesJson);

const newEducationJson = JSON.stringify([
  { school: "와부고등학교", degree: "졸업", status: "" },
  { school: "한국해양대학교", degree: "해사글로벌학부", status: "졸업" }
]);
db.prepare("UPDATE content SET value = ? WHERE key = 'education_json'").run(newEducationJson);

const newCertsJson = JSON.stringify([
  "3급항해사 면허", "2급항해사 면허", "전파전자급3급통신사", "TOEIC SPEAKING IM3", "워드프로세서 1급"
]);
db.prepare("UPDATE content SET value = ? WHERE key = 'certs_json'").run(newCertsJson);

async function startServer() {
  const app = express();
  console.log("Current working directory:", process.cwd());
  console.log("Files in root:", fs.readdirSync(process.cwd()));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.get("/api/content", (req, res) => {
    const rows = db.prepare("SELECT * FROM content").all();
    const content = rows.reduce((acc, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as any);
    res.json(content);
  });

  app.get("/api/resume/download", (req, res) => {
    const row = db.prepare("SELECT value FROM content WHERE key = 'resume_file'").get() as any;
    const nameRow = db.prepare("SELECT value FROM content WHERE key = 'resume_filename'").get() as any;
    
    if (!row || !row.value) {
      return res.status(404).send("Resume not found");
    }

    const base64Data = row.value.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const filename = nameRow?.value || "resume.pdf";

    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(filename)}`);
    res.setHeader("Content-Type", row.value.split(";")[0].split(":")[1]);
    res.send(buffer);
  });

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === "0928") {
      res.json({ success: true, token: "dummy-token-0928" });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  app.post("/api/content/update", (req, res) => {
    const { token, key, value } = req.body;
    if (token !== "dummy-token-0928") {
      return res.status(403).json({ success: false });
    }
    db.prepare("UPDATE content SET value = ? WHERE key = ?").run(value, key);
    res.json({ success: true });
  });

  // Vite middleware
  const distPath = path.resolve(process.cwd(), "dist");
  const indexPath = path.resolve(distPath, "index.html");
  const indexExists = fs.existsSync(indexPath);

  if (process.env.NODE_ENV !== "production" || !indexExists) {
    console.log(process.env.NODE_ENV !== "production" ? "Running in development mode" : "Running in production mode but index.html is missing, falling back to Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in production mode");
    console.log("Current working directory:", process.cwd());
    console.log("Dist path:", distPath);
    console.log("Index path:", indexPath);

    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error sending index.html from dist:", err);
          const rootIndexPath = path.resolve(process.cwd(), "index.html");
          console.log("Trying root index.html at:", rootIndexPath);
          res.sendFile(rootIndexPath, (err2) => {
            if (err2) {
              console.error("Error sending index.html from root:", err2);
              res.status(500).send(`
                <html>
                  <body>
                    <h1>Server Error</h1>
                    <p>Could not find index.html at: ${indexPath} or ${rootIndexPath}</p>
                    <p>Current directory: ${process.cwd()}</p>
                    <p>Files in root: ${fs.readdirSync(process.cwd()).join(", ")}</p>
                    <p>Please check if 'npm run build' was successful.</p>
                  </body>
                </html>
              `);
            }
          });
        }
      });
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
