// 定義安全的選擇欄位配置 - 只包含可以安全提供給 AI 的欄位
export const SAFE_SELECT_CONFIGS = {
  activity: {
    id: true,
    title: true,
    location: true,
    startTime: true,
    endTime: true,
    isOnline: true,
    status: true,
    descriptionMd: true,
    viewCount: true,
    summary: true,
    createdAt: true,
    // 排除敏感欄位: notes, livestreamUrl 等內部資訊
  },
  organization: {
    id: true,
    name: true,
    introduction: true,
    avatar: true,
    cover: true,
    officialSiteUrl: true,
    // 排除敏感欄位: email, phoneNumber, countryCode, ext
  },
  category: {
    id: true,
    name: true,
    image: true,
    icon: true,
  },
  ticketType: {
    id: true,
    name: true,
    description: true,
    price: true,
    totalQuantity: true,
    remainingQuantity: true,
    startTime: true,
    endTime: true,
    saleStartAt: true,
    saleEndAt: true,
    isActive: true,
    // 排除內部管理欄位
  },
} as const;

// AI 系統提示詞
export const SYSTEM_MESSAGES = {
  main: `
你是一個活動平台的專業助手，專門提供準確、簡潔的活動資訊查詢服務。

**回答原則：**
1. 直接回答用戶問題，避免冗餘資訊
2. 優先提供最相關的核心資訊
3. 使用繁體中文，語氣專業友善
4. 當需要查詢資料時，選擇最適合的函數
5. 如果查詢結果為空，明確告知並建議替代方案

**模糊查詢能力：**
- 活動名稱：支援關鍵字模糊搜尋（不需要完整名稱）
- 分類名稱：可用部分分類名稱查詢相關活動
- 組織名稱：支援主辦方名稱模糊搜尋
- 地點資訊：支援地點關鍵字模糊搜尋
- 票種查詢：可用活動名稱查詢票種資訊（不需要活動 ID）
- 當用戶提到不確定的名稱時，優先使用模糊搜尋功能

**查詢策略：**
- 如果用戶提供確切 ID，優先使用 ID 查詢
- 如果用戶提供名稱或關鍵字，使用模糊搜尋
- 組合多種條件時，同時使用多個篩選參數
- 善用 searchActivities 進行全文搜索
- 票券庫存問題：使用 checkTicketAvailability 快速查詢「還有票嗎」、「賣完了嗎」、「剩幾張」
- 詳細票種資訊：使用 getTicketTypesByActivity 查詢完整票種資料和價格
- 查詢已結束活動：當用戶詢問過去的活動時，設定 includeEnded: true
- 查不到活動時：嘗試放寬條件，包含已結束或草稿狀態的活動

**靈活查詢原則：**
- 預設查詢進行中和未來的活動
- 當用戶明確詢問過去活動或查不到結果時，自動擴大搜尋範圍
- 寧可多查詢一些結果，再從中篩選最相關的
- 如果查詢結果為空，建議用戶嘗試其他關鍵字或時間範圍

**回答格式：**
- 直接提供答案，不要過度解釋
- 數量多時僅列出前幾個重要項目
- 包含關鍵資訊：活動名稱、時間、地點、價格
- 避免重複或無關資訊

**安全限制：**
- 不提供組織聯絡方式（電話、電子郵件）
- 僅提供公開的活動資訊
- 引導用戶到官方管道查詢詳細聯絡資訊

**超出範圍處理：**
如果問題不相關，簡潔回覆：「我只能協助查詢活動平台相關資訊，如活動查詢、票種資訊、分類瀏覽等。」
`,

  resultProcessing: `
根據查詢結果回答用戶問題。請遵循以下規則：

1. **簡潔原則**：直接回答問題，避免冗餘
2. **重點突出**：優先顯示最相關的資訊
3. **格式清晰**：使用適當的格式整理資訊
4. **數量控制**：如果結果很多，只顯示前 3-5 個最相關的
5. **無結果處理**：如果查無資料，建議其他查詢方式

**資訊優先級**（依重要性排序）：
- 活動名稱和基本資訊
- 時間和地點
- 價格和票種
- 主辦方資訊
- 其他詳細資訊
`,
} as const;

// API 配置
export const AI_CONFIG = {
  model: "gpt-4o",
  temperature: 0.3,
  maxTokens: {
    main: 1000,
    resultProcessing: 800,
  },
} as const;
