"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";


export default function TimeClockDashboard() {
  const [timeClocks, setTimeClocks] = useState<any[]>([]);
  const [selectedClock, setSelectedClock] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("/api/connect-team/time/time-clocks")
      .then((res) => res.json())
      .then((data) => {console.log(data); setTimeClocks(data)});
  }, []);

  const loadUsers = (clockId: any) => {
    setSelectedClock(clockId);
    fetch(`/api/connect-team/time/time-clocks/${clockId}/users`)
      .then((res) => res.json())
      .then((data) => {console.log(data); setUsers(data)});
  };

  const loadTimeEntries = () => {
    if (!selectedClock) return;
    const query = new URLSearchParams({ startDate: from, endDate: to }).toString();
    fetch(`/api/connect-team/time/time-clocks/${selectedClock}/time?${query}`)
      .then((res) => res.json())
      .then((data) => {console.log(data); setTimeEntries(data)});
  };

  const getUserName = (userId: number) => {
    const u = users.find((u) => u.userId === userId);
    if (!u) return userId;
    return `${u.firstName} ${u.lastName}`;
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Time Clocks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {timeClocks && timeClocks.map((clock) => (
          <Card key={clock.id} onClick={() => loadUsers(clock.id)} className="cursor-pointer">
            <CardContent className="p-4">
              <p className="font-medium">{clock.name}</p>
              <p className="text-sm text-gray-500">ID: {clock.id}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClock && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Users in Clock {selectedClock}</h2>
          <ul className="list-disc pl-5">
            {users && users.map((u) => (
              <li key={u.userId}>{u.firstName} {u.lastName} (ID: {u.userId})</li>
              
            ))}
          </ul>

          <div className="flex items-end gap-4">
            <div>
              <Label>From</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <Label>To</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <Button onClick={loadTimeEntries}>Load Time Entries</Button>
          </div>

          {timeEntries.length > 0 && (
            <div className="pt-4">
              <h3 className="text-lg font-semibold">Time Entries</h3>
              <table className="min-w-full mt-2 border text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 border">User</th>
      <th className="p-2 border">Start</th>
      <th className="p-2 border">End</th>
      <th className="p-2 border">Duration</th>
    </tr>
  </thead>
  <tbody>
    {timeEntries.map((entry) => (
      <tr key={entry.id}>
        <td className="p-2 border">
          {getUserName(entry.userId)}
        </td>
        <td className="p-2 border">
          {entry.startTimestamp
            ? new Date(entry.startTimestamp * 1000).toLocaleString()
            : "-"}
        </td>
        <td className="p-2 border">
          {entry.endTimestamp
            ? new Date(entry.endTimestamp * 1000).toLocaleString()
            : "-"}
        </td>
        <td className="p-2 border">
          {entry.startTimestamp && entry.endTimestamp
            ? (() => {
                const diffMs =
                  (entry.endTimestamp - entry.startTimestamp) * 1000;
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const mins = Math.floor(
                  (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                );
                return `${hours}h ${mins}m`;
              })()
            : "n/a"}
        </td>
      </tr>
    ))}
  </tbody>
</table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}