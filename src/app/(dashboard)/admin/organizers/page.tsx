"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Organizer {
  id: number;
  name: string;
  email: string;
  eventCount: number;
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrganizers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/organizers");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const { organizers } = await res.json();
        setOrganizers(organizers);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizers();
  }, []);

  if (loading) return <p className="text-gray-300">Loading organizers…</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Organizers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="">
                <TableHead className="text-gray-100">User ID</TableHead>
                <TableHead className="text-gray-100">Name</TableHead>
                <TableHead className="text-gray-100">Email</TableHead>
                <TableHead className="text-gray-100">Events Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizers.map((org) => (
                <TableRow key={org.id} className="hover:bg-gray-700">
                  <TableCell className="text-gray-200">{org.id}</TableCell>
                  <TableCell className="text-gray-200">{org.name}</TableCell>
                  <TableCell className="text-gray-200">{org.email}</TableCell>
                  <TableCell className="text-gray-200">
                    {org.eventCount}
                  </TableCell>
                </TableRow>
              ))}
              {/* <TableRow key="demo" className="hover:bg-gray-700">
                <TableCell className="text-gray-200">50</TableCell>
                <TableCell className="text-gray-200">Deady</TableCell>
                <TableCell className="text-gray-200">deady@deady.com</TableCell>
                <TableCell className="text-gray-200">5</TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
