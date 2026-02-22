package com.satark.india;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.TelephonyManager;
import android.util.Log;
import java.util.ArrayList;

/**
 * Listens for incoming SMS and phone state changes to detect potential scam activity.
 * Data can be forwarded to the Capacitor/Next.js layer for Red Overlay UI.
 */
public class ScamMonitorReceiver extends BroadcastReceiver {

    private static final String TAG = "ScamMonitorReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;

        String action = intent.getAction();
        if (action == null) return;

        if (Telephony.SMS_RECEIVED.equals(action)) {
            handleSmsReceived(context, intent);
        } else if (TelephonyManager.ACTION_PHONE_STATE_CHANGED.equals(action)) {
            handlePhoneStateChanged(context, intent);
        }
    }

    private void handleSmsReceived(Context context, Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            ArrayList<android.telephony.SmsMessage> messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
            if (messages != null) {
                for (android.telephony.SmsMessage sms : messages) {
                    String sender = sms.getDisplayOriginatingAddress();
                    String body = sms.getDisplayMessageBody();
                    if (sender != null || body != null) {
                        Log.d(TAG, "SMS from: " + sender + " body: " + (body != null ? body : ""));
                        // TODO: Send this data to Capacitor Bridge to trigger Next.js UI Red Overlay.
                    }
                }
            }
        } else {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    for (Object pdu : pdus) {
                        android.telephony.SmsMessage sms = android.telephony.SmsMessage.createFromPdu((byte[]) pdu);
                        String sender = sms.getDisplayOriginatingAddress();
                        String body = sms.getDisplayMessageBody();
                        Log.d(TAG, "SMS from: " + sender + " body: " + (body != null ? body : ""));
                        // TODO: Send this data to Capacitor Bridge to trigger Next.js UI Red Overlay.
                    }
                }
            }
        }
    }

    private void handlePhoneStateChanged(Context context, Intent intent) {
        String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        String incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
        if (state != null) {
            Log.d(TAG, "Phone state: " + state + " incoming: " + (incomingNumber != null ? incomingNumber : ""));
            // TODO: Send this data to Capacitor Bridge to trigger Next.js UI Red Overlay.
        }
    }
}
