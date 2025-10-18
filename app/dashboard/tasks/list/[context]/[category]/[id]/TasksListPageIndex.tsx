"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { queries } from "@/src/lib/queries";
import { categorizedTasksInformation } from "@/src/lib/utils/categorizedTasks";
import { compactNumber } from "@/src/lib/utils/compactNumber";
import { fetchUserTasks } from "@/src/lib/utils/fetchers/fetchUserTasks";
import TcAccordion from "@/src/ui/components/Dashboard/TcAccordion";
import { Separator } from "@/src/ui/shadcn/components/ui/separator";
import type { TasksListPageProps } from "./page";

const LIMIT = 50;

const TasksListPageIndex = ({ context, category, id }: TasksListPageProps) => {
  const { long, description } = categorizedTasksInformation[category];
  const observerTarget = useRef<HTMLDivElement>(null);

  const { queryKey, context: queryContext } = queries.tasks.categoryList(
    category,
    context,
    id,
  );

  // Use useInfiniteQuery instead of regular query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 0 }) => {
        // Call your fetch function with the offset
        return fetchUserTasks({
          ...queryContext?.request,
          projectId: context === "project" ? id : undefined,
          parentTask: context === "task" ? id : undefined,
          limit: LIMIT,
          offset: pageParam,
        });
      },
      getNextPageParam: (lastPage) => {
        const { pagination } = lastPage?.result || {};
        if (!pagination?.hasMore) return undefined;
        return pagination.offset + pagination.limit;
      },
      initialPageParam: 0,
    });

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: "200px", // Load more when 200px before reaching the bottom
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.unobserve(element);
  }, [handleObserver]);

  // Flatten all pages into a single tasks array
  const allTasks =
    data?.pages.flatMap((page) => page?.result?.data || []) || [];
  const totalCount = data?.pages[0]?.result?.pagination?.total;

  return (
    <div className="dashboard-padding grid grid-cols-1 space-y-6">
      {/* Header */}
      <header>
        <h1 className="font-header text-4xl">
          {long} <span>{totalCount && `(${compactNumber(totalCount)})`}</span>
        </h1>
        <p className="font-body text-sm opacity-70 mt-2">{description}</p>
      </header>

      <Separator />

      {/* Content */}
      <div className="space-y-4">
        {isPending ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : allTasks?.length > 0 ? (
          <>
            {allTasks.map((task) => (
              <TcAccordion.item key={task.id} task={task} />
            ))}

            {/* Intersection Observer Target */}
            <div ref={observerTarget} className="py-4">
              {isFetchingNextPage && (
                <div className="text-center text-sm opacity-70">
                  Loading more tasks...
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 opacity-70">No tasks found</div>
        )}
      </div>
    </div>
  );
};

export default TasksListPageIndex;
