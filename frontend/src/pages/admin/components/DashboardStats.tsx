import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
  const { stats } = useMusicStore();
  console.log("Stats verisi:", stats);
  
  const safeStats = {
    totalSongs: stats?.totalSongs ?? 0,
    totalAlbums: stats?.totalAlbums ?? 0,
    totalArtists: stats?.totalArtists ?? 0,
    totalUsers: stats?.totalUsers ?? 0,
  };
  
  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: String(safeStats.totalSongs),  // ✅ `undefined` olmaması garanti
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: String(safeStats.totalAlbums), // ✅ `undefined` olmaması garanti
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: String(safeStats.totalArtists), // ✅ `undefined` olmaması garanti
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      value: safeStats.totalUsers ? safeStats.totalUsers.toLocaleString() : "0", // ✅ `undefined` olmaması garanti
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },
  ];
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
      {statsData.map((stat) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};
export default DashboardStats;
