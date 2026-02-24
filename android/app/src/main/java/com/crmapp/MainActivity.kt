package com.futurekey

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  // 🔥 IMPORTANT FIX
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

  // Main component name
  override fun getMainComponentName(): String = "FutureKey"

  // New Architecture delegate
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}