<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminMessageNotification extends Notification
{
    use Queueable;

    protected $request;
    protected $message;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($request, $message, $status)
    {
        $this->request = $request;
        $this->message = $message;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusText = $this->status === 'approved' ? 'approved' : 'rejected';
        
        return (new MailMessage)
            ->subject("Your request has been {$statusText}")
            ->line("Your request has been {$statusText}.")
            ->when($this->message, function ($mail) {
                return $mail->line('Message from admin: ' . $this->message);
            })
            ->action('View My Requests', url('/employee/my-requests'))
            ->line('Thank you for using our system!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusText = $this->status === 'approved' ? 'approved' : 'rejected';
        
        return [
            'message' => "Your request has been {$statusText}" . ($this->message ? ' with a message from admin' : ''),
            'request_id' => $this->request->id,
            'status' => $this->status,
            'admin_message' => $this->message,
        ];
    }
}
