'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          subject: subject || null,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrors(data);
          toast.error('Please correct the errors in the form.');
        } else {
          toast.error(data.detail || 'An unexpected error occurred. Please try again.');
        }
        return;
      }

      toast.success('Message sent! We will contact you soon.');
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border/80 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />
      
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Send Us a Message</h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Fill out the form below and our team will get back to you shortly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full Name <span className="text-destructive">*</span></Label>
          <Input
            id="contact-name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.name?.map((err, i) => (
            <p key={i} className="text-xs font-medium text-destructive">{err}</p>
          ))}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email Address <span className="text-destructive">*</span></Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email?.map((err, i) => (
            <p key={i} className="text-xs font-medium text-destructive">{err}</p>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="0400 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.phone?.map((err, i) => (
            <p key={i} className="text-xs font-medium text-destructive">{err}</p>
          ))}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input
            id="contact-subject"
            placeholder="General Inquiry"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            className={errors.subject ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.subject?.map((err, i) => (
            <p key={i} className="text-xs font-medium text-destructive">{err}</p>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message <span className="text-destructive">*</span></Label>
        <Textarea
          id="contact-message"
          placeholder="How can we help you today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          required
          rows={5}
          className={`resize-none ${errors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        />
        {errors.message?.map((err, i) => (
          <p key={i} className="text-xs font-medium text-destructive">{err}</p>
        ))}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 group transition-all duration-300 hover:shadow-lg py-5 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span>Send Message</span>
          </>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        * Required fields. We aim to respond within 24 hours.
      </p>
    </form>
  );
}
