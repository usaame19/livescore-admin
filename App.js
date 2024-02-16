import * as React from "react";
import AdminNav from "./app/admin/navigation/AdminNav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast, { BaseToast } from "react-native-toast-message";


const queryClient = new QueryClient();
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={
        { borderLeftColor: '#64748b', marginTop: 20, width: '90%', borderRadius: 10, backgroundColor: '#d5d9e2', opacity: 0.9, shadowColor: '#000', shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 3 }
      }
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        // justifyContent: 'center',
        // alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400'
      }}
      text2Style={{
        textAlign: 'center',
        fontSize: 16,
        color: 'grey'
      }}
    />
  ),
  // You can define other types similarly (error, info, etc.)
};
function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <AdminNav />
      <Toast config={toastConfig} position="top" />
    </QueryClientProvider>
    </>
  );
}

export default App;
