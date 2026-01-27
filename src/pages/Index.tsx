// import { StatsCard } from "@/components/dashboard/StatsCard";
// import { VisitorsChart } from "@/components/dashboard/VisitorsChart";
// import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
// import { ChatRequests } from "@/components/dashboard/ChatRequests";
// import { Demographics } from "@/components/dashboard/Demographics";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // Sample data for stats cards
// const totalUsersData = [
//   { value: 30 }, { value: 45 }, { value: 35 }, { value: 55 }, { value: 40 }, { value: 60 }, { value: 50 }, { value: 70 }
// ];
// const paidUsersData = [
//   { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, { value: 30 }, { value: 50 }, { value: 40 }, { value: 55 }
// ];
// const freeUsersData = [
//   { value: 40 }, { value: 30 }, { value: 50 }, { value: 35 }, { value: 55 }, { value: 40 }, { value: 60 }, { value: 45 }
// ];
// const newUsersData = [
//   { value: 25 }, { value: 40 }, { value: 30 }, { value: 50 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 65 }
// ];

// const Index = () => {
//   return (

//       <div className="space-y-6 animate-fade-in">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-sm text-muted-foreground font-medium">User Analytics</h1>
//           </div>
//           <Select defaultValue="month">
//             <SelectTrigger className="w-36 h-9">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="week">This Week</SelectItem>
//               <SelectItem value="month">This Month</SelectItem>
//               <SelectItem value="year">This Year</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatsCard
//             title="Total Users"
//             value="42,964"
//             chartData={totalUsersData}
//             chartColor="hsl(348, 83%, 47%)"
//             gradientId="totalUsers"
//           />
//           <StatsCard
//             title="Paid Users"
//             value="8,924"
//             chartData={paidUsersData}
//             chartColor="hsl(25, 95%, 60%)"
//             gradientId="paidUsers"
//           />
//           <StatsCard
//             title="Free Users"
//             value="26,846"
//             chartData={freeUsersData}
//             chartColor="hsl(142, 70%, 45%)"
//             gradientId="freeUsers"
//           />
//           <StatsCard
//             title="New Users"
//             value="26,846"
//             chartData={newUsersData}
//             chartColor="hsl(270, 50%, 60%)"
//             gradientId="newUsers"
//           />
//         </div>

//         {/* Charts Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2">
//             <VisitorsChart />
//           </div>
//           <ActivityFeed />
//         </div>

//         {/* Bottom Row */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <ChatRequests />
//           <Demographics />
//         </div>
//       </div>

//   );
// };

// export default Index;
