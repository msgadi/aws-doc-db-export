"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Save, Star, StarOff } from "lucide-react";

// Form validation schema
const environmentSchema = z.object({
  name: z.string().min(1, "Environment name is required"),
  hostname: z.string().min(1, "Hostname is required"),
  port: z.string().regex(/^\d+$/, "Port must be a number"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  database: z.string().min(1, "Database name is required"),
  ssl: z.boolean(),
});

type EnvironmentForm = z.infer<typeof environmentSchema>;

interface Environment {
  id: string;
  name: string;
  hostname: string;
  port: string;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  isActive: boolean;
}

// Mock data for initial environments
const mockEnvironments: Environment[] = [
  {
    id: "1",
    name: "Production",
    hostname: "prod-db.example.com",
    port: "27017",
    username: "admin",
    password: "********",
    database: "prod-db",
    ssl: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Staging",
    hostname: "staging-db.example.com",
    port: "27017",
    username: "admin",
    password: "********",
    database: "staging-db",
    ssl: false,
    isActive: false,
  },
];

interface EnvironmentCardProps {
  environment: Environment;
  onSetActive: (id: string) => void;
  onSave: (id: string, data: EnvironmentForm) => void;
}

function EnvironmentCard({
  environment,
  onSetActive,
  onSave,
}: EnvironmentCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<EnvironmentForm>({
    resolver: zodResolver(environmentSchema),
    defaultValues: {
      name: environment.name,
      hostname: environment.hostname,
      port: environment.port,
      username: environment.username,
      password: "",
      database: environment.database,
      ssl: environment.ssl,
    },
  });

  function onSubmit(data: EnvironmentForm) {
    onSave(environment.id, data);
    setIsEditing(false);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSetActive(environment.id)}
            title={
              environment.isActive ? "Active Environment" : "Set as Active"
            }
          >
            {environment.isActive ? (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </Button>
          <h3 className="text-lg font-semibold">{environment.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hostname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hostname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ssl"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Enable SSL</FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Hostname:</span>
            <span>{environment.hostname}</span>
            <span className="text-muted-foreground">Port:</span>
            <span>{environment.port}</span>
            <span className="text-muted-foreground">Username:</span>
            <span>{environment.username}</span>
            <span className="text-muted-foreground">Database:</span>
            <span>{environment.database}</span>
            <span className="text-muted-foreground">SSL:</span>
            <span>{environment.ssl ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

export function DatabaseEnvironments() {
  const [environments, setEnvironments] =
    React.useState<Environment[]>(mockEnvironments);

  const handleSetActive = (id: string) => {
    setEnvironments((envs) =>
      envs.map((env) => ({
        ...env,
        isActive: env.id === id,
      }))
    );
  };

  const handleSave = (id: string, data: EnvironmentForm) => {
    setEnvironments((envs) =>
      envs.map((env) =>
        env.id === id
          ? {
              ...env,
              ...data,
              password: data.password || env.password,
            }
          : env
      )
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {environments.map((environment) => (
        <EnvironmentCard
          key={environment.id}
          environment={environment}
          onSetActive={handleSetActive}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}
