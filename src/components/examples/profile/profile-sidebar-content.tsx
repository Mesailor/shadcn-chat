import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OTHER_USER } from "@/data/users";

export function ProfileSidebarContent() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Avatar className="size-20">
        <AvatarImage src={OTHER_USER.avatarUrl} alt={OTHER_USER.username} />
        <AvatarFallback>{OTHER_USER.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="font-medium">{OTHER_USER.name}</p>
        <p className="text-sm text-muted-foreground">{OTHER_USER.username}</p>
      </div>
    </div>
  );
}
