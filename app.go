package main

import (
	"context"
	"fmt"
	"log"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 初始化数据库
	if err := InitDatabase(); err != nil {
		log.Printf("数据库初始化失败: %v", err)
		fmt.Printf("数据库初始化失败: %v\n", err)
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetAllAnnualData 获取所有年度数据
func (a *App) GetAllAnnualData() (SystemData, error) {
	return GetAllAnnualData()
}

// GetAnnualData 获取特定年度的数据
func (a *App) GetAnnualData(year string) (*AnnualData, error) {
	return GetAnnualData(year)
}

// SaveAnnualData 保存年度数据
func (a *App) SaveAnnualData(data AnnualData) error {
	return SaveAnnualData(data)
}

// DeleteAnnualData 删除年度数据
func (a *App) DeleteAnnualData(year string) error {
	return DeleteAnnualData(year)
}

// AddTask 添加任务
func (a *App) AddTask(task Task) error {
	return AddTask(task)
}

// UpdateTask 更新任务
func (a *App) UpdateTask(task Task) error {
	return UpdateTask(task)
}

// DeleteTask 删除任务
func (a *App) DeleteTask(taskID string) error {
	return DeleteTask(taskID)
}

// ResetAllData 重置所有数据
func (a *App) ResetAllData() error {
	return ResetAllData()
}

// GetAccounts 获取所有账号
func (a *App) GetAccounts() ([]Account, error) {
	return GetAccounts()
}

// SaveAccount 保存/更新账号
func (a *App) SaveAccount(account Account) error {
	return SaveAccount(account)
}

// SwitchAccount 切换当前活跃账号
func (a *App) SwitchAccount(accountID string) error {
	return SwitchAccount(accountID)
}

// GetLastUsedAccount 获取最后使用的账号
func (a *App) GetLastUsedAccount() (*Account, error) {
	return GetLastUsedAccount()
}

// NewAccount 创建新账号
func (a *App) NewAccount(username, avatarPath string) (Account, error) {
	return NewAccount(username, avatarPath)
}

// GetAvatarAbsolutePath 获取头像的绝对路径
func (a *App) GetAvatarAbsolutePath(relativePath string) (string, error) {
	return GetAvatarAbsolutePath(relativePath)
}
