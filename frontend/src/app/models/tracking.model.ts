export interface Tracking {
  id?: number;
  userId?: number;
  userName?: string;
  userCost?: number;
  missionId?: number;
  missionName?: string;
  date?: string;
}

export interface TrackingByUser {
  user: string;
  missions: TrackingMission[];
}

export interface TrackingByMission {
  mission: string;
  users: TrackingUser[];
  totalCost?: number;
}

export interface TrackingMission {
  name: string;
  daysCount?: number;
}

export interface TrackingUser {
  name: string;
  daysCount?: number;
  daysCost?: number;
}
