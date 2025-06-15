export interface BaseQueryParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ActivityQueryParams extends BaseQueryParams {
  location?: string;
  titleKeyword?: string;
  organizationName?: string;
  minPrice?: number;
  maxPrice?: number;
  startDateFrom?: string;
  startDateTo?: string;
  includeEnded?: boolean;
  includeDraft?: boolean;
  onlyAvailable?: boolean;
}

export interface CategoryQueryParams {
  searchName?: string;
  includeCount?: boolean;
  onlyWithActivities?: boolean;
  sortBy?: "name" | "id";
}

export interface OrganizationQueryParams extends BaseQueryParams {
  includeActivityCount?: boolean;
  onlyWithActiveActivities?: boolean;
  searchName?: string;
}

export interface TicketQueryParams {
  activityId?: number;
  activityName?: string;
  onlyAvailable?: boolean;
  sortBy?: "price" | "name" | "startTime" | "endTime" | "remainingQuantity";
  sortOrder?: "asc" | "desc";
  includeDescription?: boolean;
  ticketTypeName?: string;
}

export interface SearchQueryParams extends ActivityQueryParams {
  query: string;
  categoryIds?: number[];
  categoryNames?: string[];
  organizationIds?: number[];
  organizationNames?: string[];
}

export interface ToolFunction {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties?: Record<string, any>;
      required?: string[];
      [key: string]: any;
    };
  };
}

export interface QueryResult<T = any> {
  data?: T;
  error?: string;
  suggestion?: string;
}

export interface FunctionExecutions {
  [key: string]: (args: any) => Promise<any>;
}
