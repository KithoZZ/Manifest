// 扩展 Window 接口以包含 Wails 绑定
declare global {
  interface Window {
    go?: {
      main?: {
        App?: {
          Greet: (name: string) => Promise<string>;
          GetAllAnnualData: () => Promise<any>;
          GetAnnualData: (year: string) => Promise<any>;
          SaveAnnualData: (data: any) => Promise<void>;
          DeleteAnnualData: (year: string) => Promise<void>;
          AddTask: (task: any) => Promise<void>;
          UpdateTask: (task: any) => Promise<void>;
          DeleteTask: (taskID: string) => Promise<void>;
          ResetAllData: () => Promise<void>;
        };
      };
    };
  }
}

export {};