import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../theme/colors';
import tutorService from '../../api/tutorService';

const AiTutorScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am BioScope AI, your personal anatomy tutor. What would you like to learn about today?',
      clinicalTip: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0); // FREE LIMIT: 5
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Check Premium limit (Scenario 5)
    if (questionCount >= 5) {
      navigation.navigate('Subscription');
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const response = await tutorService.chat(userMsg.text);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        clinicalTip: null 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Tutor chat error:', error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to my brain right now.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.tutorIcon}>👩‍🏫</Text>
          <Text style={styles.headerTitle}>AI Anatomy Tutor</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.chatContent} 
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        {messages.map(msg => {
          if (msg.sender === 'bot') {
            return (
              <View key={msg.id} style={styles.botMessageWrapper}>
                <Text style={styles.messageTime}><Text style={styles.botTag}>BIOSCOPE AI</Text></Text>
                <View style={styles.botBubbleLarge}>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  
                  {msg.clinicalTip && (
                    <View style={styles.clinicalTipBox}>
                      <View style={styles.clinicalTipBorder} />
                      <View style={styles.clinicalTipContent}>
                        <Text style={styles.clinicalTipLabel}>CLINICAL TIP</Text>
                        <Text style={styles.clinicalTipText}>{msg.clinicalTip}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          } else {
            return (
              <View key={msg.id} style={styles.userMessageWrapper}>
                <Text style={styles.messageTime}><Text style={styles.userTag}>YOU</Text></Text>
                <View style={styles.userBubble}>
                  <Text style={styles.userMessageText}>{msg.text}</Text>
                </View>
              </View>
            );
          }
        })}
        {isLoading && (
          <View style={styles.botMessageWrapper}>
             <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </KeyboardAwareScrollView>

      {/* Input Area */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <TextInput 
              style={styles.textInput}
              placeholder="Ask your anatomy tutor..."
              placeholderTextColor={colors.textLight}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.micBtn}>
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={isLoading}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  moreBtn: {
    padding: 5,
  },
  moreIcon: {
    fontSize: 20,
    color: colors.textDark,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  botMessageContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  botBubble: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '85%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  botBubbleLarge: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '90%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 22,
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horizontalReplies: {
    flexDirection: 'row',
    marginTop: 5,
  },
  quickReply: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EAEFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  quickReplyText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  messageTime: {
    fontSize: 10,
    color: colors.textLight,
    marginBottom: 5,
  },
  userTag: {
    fontWeight: 'bold',
    color: colors.textDark,
  },
  botTag: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  userBubble: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 16,
    borderTopRightRadius: 4,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageText: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 20,
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  clinicalTipBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F8F2',
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  clinicalTipBorder: {
    width: 4,
    backgroundColor: '#00C48C',
  },
  clinicalTipContent: {
    padding: 12,
    flex: 1,
  },
  clinicalTipLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00897B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  clinicalTipText: {
    fontSize: 12,
    color: '#00695C',
    lineHeight: 18,
  },
  inputWrapper: {
    backgroundColor: '#EAEFFF', // Light blue bottom area
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 95 : 85, // Fits floating bottom tab bar cleanly
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  micBtn: {
    padding: 5,
  },
  micIcon: {
    fontSize: 18,
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.white,
    marginLeft: 2, // Optical alignment for send arrow
  },
});

export default AiTutorScreen;
