import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

interface IWorkspaceItemProps {
  id: string;
  name: string;
}
export function WorkspaceItem(props: IWorkspaceItemProps) {
  const router = useRouter();
  return (
    <Card style={{ cursor: "pointer" }} onClick={() => router.push(`/workspaces/${props.id}`)}>
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{props.name}</CardTitle>
        <CardAction></CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">Trending up this month</div>
        <div className="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}
