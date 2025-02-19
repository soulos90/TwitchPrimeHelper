import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, ScrollView, Image, Platform, Modal, TouchableWithoutFeedback, ImageSourcePropType, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSubscription } from '../contexts/SubscriptionContext';

const taskInstructions = {
  '1': {
    title: 'Log in to Twitch',
    description: 'To mark this step as complete, log into your Twitch account.',
    link: 'https://www.twitch.tv/login',
    linkLabel: 'Go to Twitch Login',
    steps: [
      ['Open the Twitch login page.', '', require('../images/twitch_login_droid.png')],
      ['If you do not have an account, create one.', '', require('../images/twitch_login_signup_droid.png')],
      ['Enter your username and password.', '', ''],
      ['Click the "Log In" button.', '', require('../images/twitch_login_complete_droid.png')],
    ],
  },
  '2': {
    title: 'Check Amazon Prime Linkage to Twitch',
    description: 'To mark this step as complete, verify that your Twitch account is linked to Amazon Prime.',
    link: 'https://gaming.amazon.com/links/twitch/manage',
    linkLabel: 'Check Prime Linkage',
    steps: [
      ['Open the Amazon Gaming link management page.', '', require('../images/twitch_link_droid.png')],
      ['Open account menu.', '', require('../images/twitch_link_menu_droid.png')],
      ['Log In to your Amazon account.', '', require('../images/twitch_link_menu_amazon_droid.png')],
      ['Return to the Amazon Gaming link management page.', '', require('../images/twitch_link_return_droid.png')],
      ['Press Connect to a Twitch account.', '', require('../images/twitch_link_connect_droid.png')],
      ['Confirm you are linking the Amazon account with Prime to the desired Twitch account.', '', require('../images/twitch_link_confirm_droid.png')],
    ],
  },
  '3': {
    title: 'Choose Preferred Channel',
    description: 'To mark this step as complete, confirm the channel in the preferred channel input is correct. The default channel listed is the creator of this app, if you want to change it just replace the current channel name with the desired channel name.',
    link: 'https://www.twitch.tv/directory/following',
    linkLabel: 'View Followed Channels',
    steps: [
      ['One way to find a channel name is to check the channels you are following, if you are following any.', '', ''],
      ['You can also browse the categories of live channels.', '', ''],
      ['You can even pick someone from the front page of twitch.', '', ''],
    ],
  },
  '4': {
    title: 'Subscribe with Prime',
    description: 'To mark this step as complete, successfully subscribe to a channel using Twitch Prime.',
    link: 'https://www.twitch.tv/subs/{channel_name}',
    linkLabel: 'Subscribe with Prime',
    steps: [
      ['Open the subscription page for your chosen channel.', '', ''],
      ['Scroll to bottom of the page', '', ''],
      ['Check the "Use Prime Sub" checkbox', '', require('../images/twitch_sub_prime_droid.png')],
      ['If there is no checkbox either there was a mistake on one of the previous tasks, or you used your prime within the last 30 days.".', '', require('../images/twitch_sub_droid.png')],
      ['Press "Subscribe with Prime".', '', ''],
    ],
  },
};

export const TodoDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const task = taskInstructions[id as keyof typeof taskInstructions];
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { markTaskComplete, tasks, updatePreferredChannel, preferredChannel } = useSubscription();
  const router = useRouter();
  const [buttonText, setButtonText] = useState(tasks[id as string] ? 'Complete' : 'Not Complete');
  const [buttonColor, setButtonColor] = useState(tasks[id as string] ? '#34C759' : '#8a1200');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<ImageSourcePropType | null>(null);
  const [channelName, setChannelName] = useState(preferredChannel);

  useEffect(() => {
    setButtonText(tasks[id as string] ? 'Complete' : 'Not Complete');
    setButtonColor(tasks[id as string] ? '#34C759' : '#8a1200');
  }, [tasks, id]);

  const handleCompleteStep = async () => {
    await markTaskComplete(id as string);
    setButtonText(tasks[id as string] ? 'Not Complete' : 'Complete');
    setButtonColor(tasks[id as string] ? '#8a1200' : '#34C759');
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const handleImagePress = (image: ImageSourcePropType) => {
    setModalImage(image);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalImage(null);
  };

  const handleChannelNameChange = async (text: string) => {
    setChannelName(text);
    await updatePreferredChannel(text);
  };

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isScrolledToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10; // Adding a small margin for accuracy
    setShowScrollIndicator(!isScrolledToBottom);
  };
  
  return (
    <ThemedView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title} type="title">{task.title}</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ThemedText style={styles.description}>{task.description}</ThemedText>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer} 
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(contentWidth, contentHeight) => {
  setShowScrollIndicator(contentHeight > 0);
}}

        >
          {task.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>{step[0]}</ThemedText>
              {(Platform.OS === 'ios' && step[1]) || (Platform.OS === 'android' && step[2]) ? (
                <TouchableOpacity onPress={() => handleImagePress(Platform.OS === 'ios' ? step[1] : step[2])} style={styles.questionMarkButton}>
                  <Text style={styles.questionMarkText}>?</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
          {id === '3' && (
            <View style={styles.channelInputContainer}>
              <TextInput
                style={styles.channelInput}
                value={channelName}
                onChangeText={handleChannelNameChange}
                placeholder="Enter preferred channel name"
              />
            </View>
          )}
        </ScrollView>
        {showScrollIndicator && <Text style={styles.scrollIndicator}>▼ Scroll for more steps ▼</Text>}

        <View style={styles.footer}>
          {task.link && (
            <TouchableOpacity onPress={() => Linking.openURL(task.link.replace('{channel_name}', channelName))} style={styles.linkButton}>
              <Text style={styles.linkButtonText}>{task.linkLabel}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={handleCompleteStep} 
            style={styles.completeButton}
            onPressIn={() => setButtonColor(tasks[id as string] ? '#167002' : '#ff0000')}
            onPressOut={() => setButtonColor(tasks[id as string] ? '#34C759' : '#8a1200')}
          >
            <Text style={[
              styles.completeButtonText, 
              { 
                color: buttonColor, 
                marginBottom: tasks[id as string] ? 0 : 10, 
                marginLeft: tasks[id as string] ? 0 : -10 
              }
            ]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleModalClose}
        >
          <TouchableWithoutFeedback onPress={handleModalClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {modalImage && (
                  <Image source={modalImage} style={styles.modalImage} />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#064635',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  innerContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 3,
    flex: 1,
  },
  scrollIndicator: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
  headerContainer: {
    backgroundColor: '#1E88E5',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 5,
    flexDirection: 'column',  // Stack title and description
    alignItems: 'center',     // Keep text centered
    position: 'relative',     // Keep close button independent
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#357ABD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepText: {
    color: '#fff',
    flex: 1,
  },
  questionMarkButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMarkText: {
    color: '#1E88E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelInputContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  channelInput: {
    height: 40,
    borderColor: '#1E88E5',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    padding: 5,
    borderRadius: 15,
  },
  linkButton: {
    flex: 1,
    backgroundColor: '#00750e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
    maxWidth: '80%', // Prevents close button overlap
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    maxWidth: '95%', // Prevents description from stretching too wide
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  completeButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    height: 50,
    borderColor: '#969696',
  },
  completeButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    width: 90, // Wider than the button
    textAlign: 'center',
    lineHeight: 20, // Proper vertical alignment
    transform: [{ rotate: '-45deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalCloseButtonText: {
    color: '#000',
    fontSize: 24,
  },
});
