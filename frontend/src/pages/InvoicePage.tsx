import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { Loader2, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { format } from 'date-fns';

const InvoicePage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { invoiceDetails, fetchInvoice, isLoading } = useBookingStore();

  useEffect(() => {
    if (bookingId) {
      fetchInvoice(bookingId);
    }
  }, [bookingId, fetchInvoice]);
  
  const handlePrint = () => {
    window.print();
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-80px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!invoiceDetails) {
    return <div className="text-center py-16">Invoice not found or you are not authorized to view it.</div>;
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-section, #invoice-section * {
            visibility: visible;
          }
          #invoice-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 no-print">
            <h1 className="text-3xl font-bold">Invoice Details</h1>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
            </Button>
        </div>

        <Card id="invoice-section" className="border-2">
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl">Invoice</CardTitle>
                    <CardDescription>Booking ID: {invoiceDetails.bookingId}</CardDescription>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Rent-A-Car Inc.</p>
                    <p className="text-sm text-muted-foreground">Invoice Date: {format(new Date(invoiceDetails.invoiceGeneratedDate), 'PPP')}</p>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="font-semibold mb-2">Billed To:</h3>
                    <p>{invoiceDetails.customerName}</p>
                    <p className="text-muted-foreground">{invoiceDetails.customerEmail}</p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Car Details:</h3>
                    <p>{invoiceDetails.carDetails}</p>
                    <p className="text-muted-foreground">Status: <span className="capitalize font-medium text-foreground">{invoiceDetails.status}</span></p>
                </div>
            </div>
            
            <Separator className="my-6" />

            <div>
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Rental Period</span>
                        <span>{format(new Date(invoiceDetails.startDate), 'PPP')} to {format(new Date(invoiceDetails.endDate), 'PPP')}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{invoiceDetails.durationDays} Day(s)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Price Per Day</span>
                        <span>${invoiceDetails.pricePerDay.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                     <div className="flex justify-between font-semibold">
                        <span>Subtotal</span>
                        <span>${(invoiceDetails.pricePerDay * invoiceDetails.durationDays).toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between font-semibold text-xl">
                        <span>Total</span>
                        <span>${invoiceDetails.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoicePage;