'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, DollarSign, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

import { api } from '@/lib/api';
import { Job, JobFilters } from '@/types/job';
import { formatSalaryRange, formatRelativeTime } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function JobsClient() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location_type') || 'all');

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    loadJobs();
  }, [page, locationFilter]);

  async function loadJobs() {
    setLoading(true);
    try {
      const filters: JobFilters = {
        page,
        page_size: PAGE_SIZE,
        sort: 'score',
      };

      if (searchQuery) filters.search = searchQuery;
      if (locationFilter && locationFilter !== 'all') filters.location_type = locationFilter;

      const response = await api.getJobs(filters);
      setJobs(response.results);
      setTotal(response.count || 0);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search & Filter Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-gray-600">
          {total.toLocaleString()} jobs found
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
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

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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
                              <span>{formatSalaryRange(job.salary_min, job.salary_max)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{formatRelativeTime(job.posted_date)}</span>
                          </div>
                        </div>

                        {job.required_skills && job.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.slice(0, 6).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.required_skills.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.required_skills.length - 6}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                          Apply
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Detail Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{selectedJob.company.name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedJob.location}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {selectedJob.location_type}
                    </Badge>
                    {selectedJob.salary_min && (
                      <div className="flex items-center gap-1 text-green-700">
                        <DollarSign className="h-4 w-4" />
                        {formatSalaryRange(selectedJob.salary_min, selectedJob.salary_max)}
                      </div>
                    )}
                  </div>
                </div>

                {selectedJob.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                  </div>
                )}

                {selectedJob.required_skills && selectedJob.required_skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.required_skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    asChild
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <a href={selectedJob.source_url} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedJob(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
