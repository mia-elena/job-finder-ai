"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";

import { api } from "@/lib/api";
import type { Job } from "@/types/job";
import { formatSalaryRange, formatRelativeTime } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await api.getJobs({ sort: "score", page: 1, page_size: 20 });
        setJobs(response.results);
        setTotalJobs(response.count || 0);
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (locationQuery) params.set("location", locationQuery);
    router.push(`/jobs?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Find Your Next Job
            </h1>
            <p className="text-lg text-gray-600">
              {totalJobs.toLocaleString()} opportunities available
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="City or remote"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="pl-12 h-14 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700">
                Search Jobs
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Recommended Jobs
          </h2>
          <Button
            variant="outline"
            onClick={() => router.push("/jobs")}
          >
            View All Jobs
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/jobs?id=${job.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          {job.title}
                        </h3>
                        {job.score && job.score.total_score >= 70 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {Math.round(job.score.total_score)}% Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-base font-medium text-gray-700 mb-3">
                        {job.company.name}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {job.location_type}
                        </Badge>
                        {job.salary_min && (
                          <div className="flex items-center gap-1 text-green-700">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">
                              {formatSalaryRange(job.salary_min, job.salary_max)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatRelativeTime(job.posted_date)}</span>
                        </div>
                      </div>

                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.required_skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.required_skills.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <a
                        href={job.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {jobs.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/jobs")}
            >
              View All {totalJobs.toLocaleString()} Jobs
            </Button>
          </div>
        )}
      </div>

      {/* Simple Footer CTA */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to find your next opportunity?
          </h2>
          <p className="text-gray-600 mb-6">
            Create job alerts and customize your preferences
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/profile")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Manage Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
