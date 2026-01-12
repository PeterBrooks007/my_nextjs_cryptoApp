import { ChevronDown, Send } from "lucide-react";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { Popover, PopoverTrigger } from "./ui/popover";

import { sanitizedString } from "@/lib/zodSanitizeUtil";
import * as z from "zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "./ui/field";
import { useAddMail } from "@/hooks/useMailbox";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useAuth";

// formSchema
export const formSchema = z.object({
  subject: sanitizedString("Wallet Name contains invalid characters")
    .trim()
    .min(1, "subject is required.")
    .max(50, "subject cannot exceed 50 characters"),

  comment: sanitizedString("comment contains invalid characters")
    .trim()
    .min(1, "Comment is required.")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

const ComposeNewMessage = ({
  composeMessageType,
}: {
  composeMessageType: string;
}) => {
  const { mutate, isPending } = useAddMail();

  const { data: user } = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>("Support Team");

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      subject: "",
      comment: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!value) {
      return toast.error("Please select a user");
    }

    const formData = {
      userId: composeMessageType === "compose" ? user?._id : "",
      messages: [
        {
          to: "Support Team",
          from: user?.email,
          subject: data.subject,
          content: data.comment,
        },
      ],
    };

    mutate(formData);

    setValue(null);
    form.reset(); // clear input
  }

  if (isPending) {
    return (
      <div className="flex h-full justify-center items-center ">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <form
      id="form-rhf-demo"
      className="flex-1 flex flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex-1 flex flex-col">
        <div className="w-full flex flex-row gap-2">
          <div className="flex-1">
            <Popover open={open} onOpenChange={setOpen} modal={true}>
              <PopoverTrigger asChild>
                <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                  <InputGroupAddon>
                    <InputGroupText>To:</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    value={value ? value : ""}
                    placeholder="Select A User..."
                    readOnly
                  />
                  <InputGroupAddon align="inline-end">
                    <ChevronDown />
                  </InputGroupAddon>
                </InputGroup>
              </PopoverTrigger>

              {/* <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Search Users..." className="h-9" />
                  <CommandList className="max-h-30 xs:max-h-64 overflow-y-auto touch-pan-y">
                    <CommandEmpty>No User found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value={user?.firstname}
                        key={user?._id}
                        onSelect={() => {
                          setValue(
                            value?.firstname === user.firstname ? null : user
                          );
                          setOpen(false);
                        }}
                      ></CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent> */}
            </Popover>
          </div>
        </div>

        <div>
          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputGroup className=" rounded-none h-12 dark:bg-transparent">
                  <InputGroupAddon>
                    <InputGroupText>Subject:</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter Subject"
                    className="text-base!"
                  />
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <InputGroup className="rounded-none flex-1 max-h-[40vh] xs:max-h-[45vh] sm:max-h-full dark:bg-transparent">
                  <InputGroupTextarea
                    {...field}
                    id="form-rhf-demo-description"
                    placeholder="Message Content"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end" className="border-t">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/1000 characters
                    </InputGroupText>
                    <InputGroupButton
                      type="submit"
                      size="sm"
                      className="ml-auto"
                      variant="default"
                      disabled={isPending}
                    >
                      {isPending ? <Spinner /> : <Send />}
                      Send Message
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default ComposeNewMessage;
