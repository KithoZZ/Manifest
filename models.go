package main

type Account struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	AvatarPath string `json:"avatarPath"`
}

type Config struct {
	LastUsedID string    `json:"lastUsedID"`
	Accounts   []Account `json:"accounts"`
}

type Task struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Status      string  `json:"status"` // not-started, in-progress, completed
	Score       float64 `json:"score"`
	Priority    string  `json:"priority"` // low, medium, high
	StartDate   *string `json:"startDate,omitempty"`
	EndDate     *string `json:"endDate,omitempty"`
}

type DimensionConfig struct {
	Key       string `json:"key"`
	Title     string `json:"title"`
	Icon      string `json:"icon"`
	Color     string `json:"color"`
	IsDefault bool   `json:"isDefault"`
}

type ScoringSettings struct {
	CompletedScore   float64            `json:"completedScore"`
	InProgressScore  float64            `json:"inProgressScore"`
	NotStartedScore  float64            `json:"notStartedScore"`
	DimensionWeights map[string]float64 `json:"dimensionWeights,omitempty"`
	ExtraFields      map[string]interface{} `json:"-,omitempty"` // For any additional fields
}

type DimensionSettings struct {
	Scoring ScoringSettings `json:"scoring"`
}

type DimensionData struct {
	AnnualGoal     string            `json:"annualGoal"`
	QuarterlyGoals []string          `json:"quarterlyGoals"`
	MonthlyTasks   [][]Task          `json:"monthlyTasks"`
	TotalScore     float64           `json:"totalScore"`
	CompletedTasks int               `json:"completedTasks"`
	TotalTasks     int               `json:"totalTasks"`
	Progress       int               `json:"progress"`
	Settings       DimensionSettings `json:"settings"`
}

type AnnualSettings struct {
	Scoring ScoringSettings `json:"scoring"`
}

type AnnualData struct {
	Year              string                 `json:"year"`
	TotalScore        float64                `json:"totalScore"`
	Settings          AnnualSettings         `json:"settings"`
	DimensionConfigs  []DimensionConfig      `json:"dimensionConfigs"`
	Dimensions        map[string]DimensionData `json:"dimensions"`
}

type SystemData map[string]AnnualData
