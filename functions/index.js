const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const BASE_URL = "https://dumvivimosmyra.github.io/emir-pelin-site/";
const ICON_URL = BASE_URL + "icon.png";

exports.sendMessageNotification = functions.database
    .ref("/chatMessages")
    .onWrite(async (change) => {
      const after = change.after.val();
      const before = change.before.val();

      if (!after) return null;

      const afterArr = Array.isArray(after) ?
        after : Object.values(after);
      const beforeArr = before ?
        (Array.isArray(before) ? before : Object.values(before)) : [];

      if (afterArr.length <= beforeArr.length) return null;

      const lastMsg = afterArr[afterArr.length - 1];
      if (!lastMsg) return null;

      const sender = lastMsg.sender;
      const text = lastMsg.text;
      const receiver = sender === "emir" ? "pelin" : "emir";

      const tokenSnap = await admin.database()
          .ref(`/fcmTokens/${receiver}`).once("value");
      const token = tokenSnap.val();

      if (!token) {
        console.log(`${receiver} icin FCM token bulunamadi`);
        return null;
      }

      const senderName = sender === "emir" ? "Emir Kagan" : "Pelin";
      const body = text.length > 100 ?
        text.substring(0, 100) + "..." : text;

      const message = {
        token: token,
        notification: {title: senderName, body},
        webpush: {
          fcmOptions: {link: BASE_URL},
          notification: {
            icon: ICON_URL,
            badge: ICON_URL,
            vibrate: [200, 100, 200],
          },
        },
      };

      try {
        await admin.messaging().send(message);
        console.log(`Bildirim gonderildi: ${receiver}`);
      } catch (err) {
        console.error("Bildirim hatasi:", err);
        const invalid = [
          "messaging/invalid-registration-token",
          "messaging/registration-token-not-registered",
        ];
        if (invalid.includes(err.code)) {
          await admin.database()
              .ref(`/fcmTokens/${receiver}`).remove();
        }
      }

      return null;
    });
