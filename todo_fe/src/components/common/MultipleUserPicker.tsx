import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type UserOption = { id: string; name: string; email: string };

interface MultiUserPickerProps {
  users: UserOption[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
}

export function MultiUserPicker({ users, selected, onChange, placeholder }: MultiUserPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (id: string) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-auto min-h-10 py-2 px-3">
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((id) => {
                const user = users.find((u) => u.id === id);
                return (
                  <Badge key={id} variant="secondary" className="mr-1">
                    {user?.name}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(id);
                      }}
                    />
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    onChange(
                      selected.includes(user.id) ? selected.filter((s) => s !== user.id) : [...selected, user.id],
                    );
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selected.includes(user.id) ? "opacity-100" : "opacity-0")} />
                  {user.name} ({user.email})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
