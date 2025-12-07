import { UserProfile } from "@clerk/nextjs";
import { AddCategoryDrawer } from "@/components/categories/add-category-drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddCategoryDrawer />
        </CardContent>
      </Card>

      <div className="flex justify-center">
          <UserProfile />
      </div>
    </div>
  );
}
