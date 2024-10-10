// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// };

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};




//This will be definitions for the hatchery
// verification_token table
export type VerificationToken = {
  identifier: string;
  expires: string; // TIMESTAMPTZ will be a string in TypeScript
  token: string;
};

// accounts table
export type Account = {
  id: number; // SERIAL type in PostgreSQL is an integer
  userId: number;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null; // Assuming it can be null
  accessToken: string | null;  // Assuming it can be null
  expiresAt: number | null;    // BIGINT is a number in TypeScript, can be null
  idToken: string | null;      // Assuming it can be null
  scope: string | null;        // Assuming it can be null
  sessionState: string | null; // Assuming it can be null
  tokenType: string | null;    // Assuming it can be null
};

// sessions table
export type Session = {
  id: number; // SERIAL type in PostgreSQL is an integer
  userId: number;
  expires: string; // TIMESTAMPTZ will be a string in TypeScript
  sessionToken: string;
};

// users table
export type User = {
  id: number; // SERIAL type in PostgreSQL is an integer
  name: string | null;  // Assuming it can be null
  email: string | null; // Assuming it can be null
  emailVerified: string | null; // TIMESTAMPTZ will be a string in TypeScript, can be null
  image: string | null; // Assuming it can be null
  password: string;
  role: string;
};
