package com.iterators.access;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import co.fitcom.fingerprintauth.FingerPrintAuthPlugin;
import com.nikosdouvlis.navigationbar.NavigationBar;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge1
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(FingerPrintAuthPlugin.class);
      add(NavigationBar.class);
    }});
  }
}
