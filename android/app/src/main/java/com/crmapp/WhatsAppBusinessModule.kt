package com.futurekey

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.*

class WhatsAppBusinessModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WhatsAppBusiness"
    }

    @ReactMethod
    fun open(phone: String, message: String) {

        val url = "https://api.whatsapp.com/send?phone=$phone&text=$message"

        val intent = Intent(Intent.ACTION_VIEW)
        intent.data = Uri.parse(url)
        intent.setPackage("com.whatsapp.w4b") // WhatsApp Business
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

        reactApplicationContext.startActivity(intent)
    }
}