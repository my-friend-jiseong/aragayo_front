import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirebaseInitService {
  static Future<void> initialize() async {
    await Firebase.initializeApp();
  }

  static Future<UserCredential> signInAnonymously() async {
    return await FirebaseAuth.instance.signInAnonymously();
  }

  static User? getCurrentUser() {
    return FirebaseAuth.instance.currentUser;
  }
}

