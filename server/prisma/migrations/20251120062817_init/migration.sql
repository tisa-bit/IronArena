-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyname" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "categoryname" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Control" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "tips" TEXT,
    "mediaLink" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Control_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
