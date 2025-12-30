package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

// ConfigFilePath 配置文件路径
const ConfigFilePath = ".manifest/config.json"

// GetConfigPath 获取完整的配置文件路径
func GetConfigPath() (string, error) {
	// 获取用户主目录
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("获取用户主目录失败: %w", err)
	}

	// 配置文件完整路径
	configPath := filepath.Join(homeDir, ConfigFilePath)
	return configPath, nil
}

// GetAppDataDir 获取应用数据目录
func GetAppDataDir() (string, error) {
	// 获取用户主目录
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("获取用户主目录失败: %w", err)
	}

	// 应用数据目录
	appDataDir := filepath.Join(homeDir, ".manifest")
	return appDataDir, nil
}

// LoadConfig 加载配置文件
func LoadConfig() (*Config, error) {
	// 获取配置文件路径
	configPath, err := GetConfigPath()
	if err != nil {
		return nil, err
	}

	// 检查文件是否存在
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		// 文件不存在，返回默认配置
		return &Config{Accounts: []Account{}}, nil
	}

	// 读取配置文件
	configData, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	// 解析配置文件
	var config Config
	if err := json.Unmarshal(configData, &config); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	return &config, nil
}

// SaveConfig 保存配置文件
func SaveConfig(config *Config) error {
	// 获取配置文件路径
	configPath, err := GetConfigPath()
	if err != nil {
		return err
	}

	// 确保目录存在
	configDir := filepath.Dir(configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("创建配置目录失败: %w", err)
	}

	// 序列化配置
	configData, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("序列化配置失败: %w", err)
	}

	// 写入配置文件
	if err := os.WriteFile(configPath, configData, 0644); err != nil {
		return fmt.Errorf("写入配置文件失败: %w", err)
	}

	return nil
}

// GetAccounts 获取所有账号
func GetAccounts() ([]Account, error) {
	config, err := LoadConfig()
	if err != nil {
		return nil, err
	}

	return config.Accounts, nil
}

// SaveAccount 保存/更新账号
func SaveAccount(account Account) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}

	// 检查账号是否已存在
	for i, acc := range config.Accounts {
		if acc.ID == account.ID {
			// 更新现有账号
			config.Accounts[i] = account
			return SaveConfig(config)
		}
	}

	// 添加新账号
	config.Accounts = append(config.Accounts, account)
	return SaveConfig(config)
}

// SwitchAccount 切换当前活跃账号
func SwitchAccount(accountID string) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}

	// 检查账号是否存在
	accountExists := false
	for _, acc := range config.Accounts {
		if acc.ID == accountID {
			accountExists = true
			break
		}
	}

	if !accountExists {
		return fmt.Errorf("账号不存在")
	}

	// 更新最后使用的账号ID
	config.LastUsedID = accountID
	return SaveConfig(config)
}

// GetLastUsedAccount 获取最后使用的账号
func GetLastUsedAccount() (*Account, error) {
	config, err := LoadConfig()
	if err != nil {
		return nil, err
	}

	if config.LastUsedID == "" || len(config.Accounts) == 0 {
		return nil, nil
	}

	// 查找最后使用的账号
	for _, acc := range config.Accounts {
		if acc.ID == config.LastUsedID {
			return &acc, nil
		}
	}

	return nil, nil
}

// CopyAvatarToAppDir 复制头像到应用目录
func CopyAvatarToAppDir(sourcePath string) (string, error) {
	// 获取应用数据目录
	appDataDir, err := GetAppDataDir()
	if err != nil {
		return "", err
	}

	// 创建avatars目录
	avatarsDir := filepath.Join(appDataDir, "avatars")
	if err := os.MkdirAll(avatarsDir, 0755); err != nil {
		return "", fmt.Errorf("创建avatars目录失败: %w", err)
	}

	// 生成唯一的文件名
	extension := filepath.Ext(sourcePath)
	newFilename := fmt.Sprintf("%s%s", uuid.New().String(), extension)

	// 目标路径
	targetPath := filepath.Join(avatarsDir, newFilename)

	// 读取源文件
	sourceData, err := os.ReadFile(sourcePath)
	if err != nil {
		return "", fmt.Errorf("读取源文件失败: %w", err)
	}

	// 写入目标文件
	if err := os.WriteFile(targetPath, sourceData, 0644); err != nil {
		return "", fmt.Errorf("写入目标文件失败: %w", err)
	}

	// 返回相对于appDataDir的路径
	relativePath := filepath.Join("avatars", newFilename)
	return relativePath, nil
}

// GetAvatarAbsolutePath 获取头像的绝对路径
func GetAvatarAbsolutePath(relativePath string) (string, error) {
	// 如果是绝对路径，直接返回
	if filepath.IsAbs(relativePath) {
		return relativePath, nil
	}

	// 获取应用数据目录
	appDataDir, err := GetAppDataDir()
	if err != nil {
		return "", err
	}

	// 构建绝对路径
	absolutePath := filepath.Join(appDataDir, relativePath)
	return absolutePath, nil
}

// NewAccount 创建新账号
func NewAccount(username, avatarPath string) (Account, error) {
	// 如果是绝对路径，复制到应用目录
	if filepath.IsAbs(avatarPath) {
		var err error
		avatarPath, err = CopyAvatarToAppDir(avatarPath)
		if err != nil {
			return Account{}, err
		}
	}

	// 创建新账号
	account := Account{
		ID:         uuid.New().String(),
		Username:   username,
		AvatarPath: avatarPath,
	}

	// 保存账号
	if err := SaveAccount(account); err != nil {
		return Account{}, err
	}

	// 设置为当前使用的账号
	if err := SwitchAccount(account.ID); err != nil {
		return Account{}, err
	}

	return account, nil
}
