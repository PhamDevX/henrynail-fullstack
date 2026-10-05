-- CreateTable
CREATE TABLE "ShopHoliday" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateKey" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShopHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopHoliday_dateKey_key" ON "ShopHoliday"("dateKey");

-- CreateIndex
CREATE INDEX "ShopHoliday_date_idx" ON "ShopHoliday"("date");
