import type { INodeProperties } from "n8n-workflow";

export const feedbackOperations: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: { show: { resource: ["feedback"] } },
    options: [
      { name: "Archive", value: "archive", action: "Archive a feedback item" },
      {
        name: "Change Status",
        value: "changeStatus",
        action: "Change feedback status",
      },
      {
        name: "Create",
        value: "create",
        action: "Create a feedback item",
        description:
          "Create a new feedback item. When an author is set, an upvote from that author is added automatically.",
      },
      { name: "Delete", value: "delete", action: "Delete a feedback item" },
      { name: "Get", value: "get", action: "Get a feedback item" },
      { name: "Get Many", value: "getMany", action: "Get many feedback items" },
      {
        name: "Unarchive",
        value: "unarchive",
        action: "Unarchive a feedback item",
      },
      { name: "Update", value: "update", action: "Update a feedback item" },
    ],
    default: "create",
  },
];

export const feedbackFields: INodeProperties[] = [
  // ------ Create ------
  {
    displayName: "Title",
    name: "title",
    type: "string",
    required: true,
    default: "",
    description: "The title of the feedback item",
    displayOptions: { show: { resource: ["feedback"], operation: ["create"] } },
  },
  {
    displayName: "Category Name or ID",
    name: "categoryId",
    type: "options",
    required: true,
    typeOptions: { loadOptionsMethod: "getCategories" },
    default: "",
    description:
      'The category to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    displayOptions: { show: { resource: ["feedback"], operation: ["create"] } },
  },
  {
    displayName: "Additional Fields",
    name: "additionalFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["feedback"], operation: ["create"] } },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        description: "Whether to create the feedback item as archived",
      },
      {
        displayName: "Assignee Name or ID",
        name: "assignee_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getTeamMembers" },
        default: "",
        description:
          'The team member to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Author Name or ID",
        name: "author_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getUsers" },
        default: "",
        description:
          'The user to set as author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Content",
        name: "content",
        type: "string",
        typeOptions: { rows: 4 },
        default: "",
        description: "The body content of the feedback item",
      },
      {
        displayName: "Custom Fields",
        name: "custom_fields",
        type: "json",
        default: "{}",
        description:
          'Custom field values as a JSON object (e.g. {"field_name": "value"})',
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        default: "",
        placeholder: "e.g. user@example.com",
        description: "The email of the feedback author",
      },
      {
        displayName: "External User ID",
        name: "external_user_id",
        type: "string",
        default: "",
        description: "An external user identifier from your system",
      },
      {
        displayName: "Image Private",
        name: "image_private",
        type: "boolean",
        default: false,
        description: "Whether the screenshot is restricted to team-only",
      },
      {
        displayName: "Launch Date",
        name: "launch_date",
        type: "string",
        default: "",
        description:
          'The planned launch date for this feedback item (free text, e.g. "Q3 2026" or "2026-06-01")',
      },
      {
        displayName: "Pinned",
        name: "pinned",
        type: "boolean",
        default: false,
        description: "Whether to pin the feedback item",
      },
      {
        displayName: "Priority",
        name: "priority",
        type: "number",
        typeOptions: { minValue: 0, maxValue: 5 },
        default: 0,
        description: "The priority level of the feedback item (0-5)",
      },
      {
        displayName: "Private",
        name: "private",
        type: "boolean",
        default: false,
        description:
          "Whether this feedback item should be private (not visible on the portal)",
      },
      {
        displayName: "Source",
        name: "source",
        type: "string",
        default: "",
        placeholder: "e.g. https://example.com/ticket/123",
        description: "The source of this feedback (URL or free text)",
      },
      {
        displayName: "Status Name or ID",
        name: "status_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getStatuses" },
        default: "",
        description:
          'The status to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Tag Names or IDs",
        name: "tags",
        type: "multiOptions",
        typeOptions: { loadOptionsMethod: "getTags" },
        default: [],
        description:
          'Tags to assign. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Votes Offset",
        name: "votes_offset",
        type: "number",
        typeOptions: { minValue: 0, maxValue: 9999 },
        default: 0,
        description:
          "Number of votes to add as an offset (e.g. when migrating from another tool)",
      },
    ],
  },

  // ------ Get / Update / Delete / etc. ------
  {
    displayName: "Feedback ID",
    name: "feedbackId",
    type: "string",
    required: true,
    default: "",
    placeholder: "e.g. a1b2c3d4-e5f6-...",
    description: "The ID of the feedback item",
    displayOptions: {
      show: {
        resource: ["feedback"],
        operation: [
          "get",
          "update",
          "delete",
          "changeStatus",
          "archive",
          "unarchive",
        ],
      },
    },
  },

  // ------ Get: Simplify ------
  {
    displayName: "Simplify",
    name: "simplify",
    type: "boolean",
    default: true,
    displayOptions: { show: { resource: ["feedback"], operation: ["get"] } },
    description:
      "Whether to return a simplified version of the response instead of the raw data",
  },

  // ------ Get Many ------
  {
    displayName: "Return All",
    name: "returnAll",
    type: "boolean",
    default: false,
    displayOptions: {
      show: { resource: ["feedback"], operation: ["getMany"] },
    },
    description: "Whether to return all results or only up to a given limit",
  },
  {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    typeOptions: { minValue: 1, maxValue: 100 },
    displayOptions: {
      show: {
        resource: ["feedback"],
        operation: ["getMany"],
        returnAll: [false],
      },
    },
    description: "Max number of results to return",
  },
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: {
      show: { resource: ["feedback"], operation: ["getMany"] },
    },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        description: "Whether to include archived feedback items",
      },
      {
        displayName: "Category Name or ID",
        name: "category_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getCategories" },
        default: "",
        description:
          'Filter by category. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Search",
        name: "search",
        type: "string",
        default: "",
        description: "Search feedback items by title or content",
      },
      {
        displayName: "Status Name or ID",
        name: "status_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getStatuses" },
        default: "",
        description:
          'Filter by status. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
    ],
  },

  // ------ Update ------
  {
    displayName: "Update Fields",
    name: "updateFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: { show: { resource: ["feedback"], operation: ["update"] } },
    options: [
      {
        displayName: "Archived",
        name: "archived",
        type: "boolean",
        default: false,
        description: "Whether to archive or unarchive the feedback item",
      },
      {
        displayName: "Assignee Name or ID",
        name: "assignee_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getTeamMembers" },
        default: "",
        description:
          'The team member to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Author Name or ID",
        name: "author_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getUsers" },
        default: "",
        description:
          'The user to set as author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Category Name or ID",
        name: "category_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getCategories" },
        default: "",
        description:
          'The category to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Content",
        name: "content",
        type: "string",
        typeOptions: { rows: 4 },
        default: "",
        description: "The body content of the feedback item",
      },
      {
        displayName: "Custom Fields",
        name: "custom_fields",
        type: "json",
        default: "{}",
        description:
          'Custom field values as a JSON object (e.g. {"field_name": "value"})',
      },
      {
        displayName: "Email",
        name: "email",
        type: "string",
        default: "",
        placeholder: "e.g. user@example.com",
        description: "The email of the feedback author",
      },
      {
        displayName: "External User ID",
        name: "external_user_id",
        type: "string",
        default: "",
        description: "An external user identifier from your system",
      },
      {
        displayName: "Image Private",
        name: "image_private",
        type: "boolean",
        default: false,
        description: "Whether the screenshot is restricted to team-only",
      },
      {
        displayName: "Launch Date",
        name: "launch_date",
        type: "string",
        default: "",
        description:
          'The planned launch date for this feedback item (free text, e.g. "Q3 2026" or "2026-06-01")',
      },
      {
        displayName: "Pinned",
        name: "pinned",
        type: "boolean",
        default: false,
        description: "Whether to pin or unpin the feedback item",
      },
      {
        displayName: "Priority",
        name: "priority",
        type: "number",
        typeOptions: { minValue: 0, maxValue: 5 },
        default: 0,
        description: "The priority level of the feedback item (0-5)",
      },
      {
        displayName: "Private",
        name: "private",
        type: "boolean",
        default: false,
        description: "Whether this feedback item should be private",
      },
      {
        displayName: "Source",
        name: "source",
        type: "string",
        default: "",
        placeholder: "e.g. https://example.com/ticket/123",
        description: "The source of this feedback (URL or free text)",
      },
      {
        displayName: "Status Name or ID",
        name: "status_id",
        type: "options",
        typeOptions: { loadOptionsMethod: "getStatuses" },
        default: "",
        description:
          'The status to assign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Tag Names or IDs",
        name: "tags",
        type: "multiOptions",
        typeOptions: { loadOptionsMethod: "getTags" },
        default: [],
        description:
          'Tags to assign. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description: "The title of the feedback item",
      },
      {
        displayName: "Votes Offset",
        name: "votes_offset",
        type: "number",
        typeOptions: { minValue: 0, maxValue: 9999 },
        default: 0,
        description:
          "Number of votes to add as an offset (e.g. when migrating from another tool)",
      },
    ],
  },

  // ------ Change Status ------
  {
    displayName: "Status Name or ID",
    name: "statusId",
    type: "options",
    required: true,
    typeOptions: { loadOptionsMethod: "getStatuses" },
    default: "",
    description:
      'The new status to set. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    displayOptions: {
      show: { resource: ["feedback"], operation: ["changeStatus"] },
    },
  },
  {
    displayName: "Notify Voters",
    name: "notifyStatusChange",
    type: "boolean",
    default: false,
    description:
      "Whether to send email notifications to all upvoters about the status change. Assignee notifications are always sent automatically.",
    displayOptions: {
      show: { resource: ["feedback"], operation: ["changeStatus"] },
    },
  },
];
