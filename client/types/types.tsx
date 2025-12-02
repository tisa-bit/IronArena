export type Role = "Admin" | "User";

export type SignUpFormInputs = {
  firstname: string;
  lastname: string;
  companyname: string;
  password: string;
  email: string;
  confirmpassword: string;
  companylogo: string;
};
export type Category = {
  id?: number;
  categoryname: string;
  _count?: {
    controls: number;
  };
};

export type Controls = {
  id: number;
  controlnumber: string;
  categoryId: string;
  description: string;
  tips: string;
  mediaLink: string;
  attachmentRequired: boolean;
  controlmapping: string;
  category: Category;
  answers?: Answer[];
};

export type User = {
  subscriptionStatus: string;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  companyname: string | null;
  profilePic: string;
  istwoFAEnabled: boolean;
};

export type AddUserRequest = {
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
};

export type AddUserResponse = User;

export type UserFormProps = {
  onClose: () => void;
  user?: User | null;
  onUserUpdate?: (user: User) => void;
  onSuccess?: () => void;
};

export type Props = { params: { id: string } };

export type CategoryFormProps = {
  category?: Category | null;
  onClose?: () => void;
  onSuccess?: () => void;
};

export type ControlFormProps = {
  control?: Controls | null;
  onClose?: () => void;
  onSuccess?: () => void;
};

export type Answer = {
  status: string;
  reason?: string;
  attachment?: string;
};

export type UpdateUserRequest = {
  firstname?: string;
  lastname?: string;
  email?: string;
};

export type   fetchCategoriesResponse = {
  categories: Category[];
  meta: {
    page: number;
    actuallimit: number;
    total: number;
    totalPages: number;
  };
};

export type fetchControlResponse = {
  controls: Controls[];
  meta: {
    page: number;
    actuallimit: number;
    total: number;
    totalPages: number;
  };
};

export type fetchUserResponse = {
  users: User[];
  meta: {
    page: number;
    actualLimit: number;
    total: number;
    totalPages: number;
  };
};

export type Plan = {
  id: number;
  name: string;
  priceId: string;
  plandescription: string;
  amount: number;
  currency: string;
};

export type Transaction = {
  username: string;
  email: string;
  date: string;
  planName: string;
  amount: number;
  currency: string;
  invoiceNo: string;
  invoicePdfUrl: string;
};

export type Log = {
  id: number;
  userId: number;
  action: string;
  details?: string | null;
  createdAt: string; 
  user: User;
  readableMessage?: string; 
};
