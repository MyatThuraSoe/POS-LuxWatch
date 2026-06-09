import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PurchaseOrder, ReceiveOrderData, ReceiveOrderItemData } from "@/types/purchaseOrder";

const receivingItemSchema = z.object({
  itemId: z.number(),
  quantityReceived: z.number().min(0, "Quantity must be at least 0"),
  condition: z.enum(["good", "damaged"]).optional(),
  notes: z.string().optional(),
});

const receivingFormSchema = z.object({
  items: z.array(receivingItemSchema),
  receivedDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof receivingFormSchema>;

interface ReceivingFormProps {
  purchaseOrder: PurchaseOrder;
  onSubmit: (data: ReceiveOrderData) => void;
  isLoading?: boolean;
}

export function ReceivingForm({
  purchaseOrder,
  onSubmit,
  isLoading,
}: ReceivingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(receivingFormSchema),
    defaultValues: {
      receivedDate: new Date().toISOString().split("T")[0],
      notes: "",
      items: purchaseOrder.items.map((item) => ({
        itemId: item.id || 0,
        quantityReceived: item.quantityPending,
        condition: "good" as const,
        notes: "",
      })),
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="receivedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Received Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Items to Receive</h3>
          
          {purchaseOrder.items.map((item, index) => (
            <div key={item.productId || index} className="border p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <p className="font-medium">{item.productName}</p>
                  {item.productSku && <p className="text-sm text-muted-foreground">{item.productSku}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ordered</p>
                  <p className="font-medium">{item.quantityOrdered}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Already Received</p>
                  <p className="font-medium">{item.quantityReceived}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.quantityReceived`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity to Receive</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantityPending}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Pending: {item.quantityPending}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.condition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Receiving notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiving Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this receipt..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Receipt"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
