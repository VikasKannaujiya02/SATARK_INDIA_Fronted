package com.satark.india;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import androidx.annotation.Nullable;

/**
 * Stub for a persistent foreground service to keep SMS/Call scanner alive 24/7
 * as a Truecaller alternative.
 * TODO: Implement persistent notification to keep the SMS/Call scanner alive 24/7 as a Truecaller alternative.
 */
public class SatarkForegroundService extends Service {

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // TODO: Implement persistent notification to keep the SMS/Call scanner alive 24/7 as a Truecaller alternative.
        return START_NOT_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
