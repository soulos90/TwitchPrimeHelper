import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, ScrollView, Image, Platform, Modal, TouchableWithoutFeedback, ImageSourcePropType, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSubscription } from '../contexts/SubscriptionContext';
import { scheduleNotification } from '../utils/NotificationHandler';

const taskInstructions = {
  '1': {
    title: 'Log in to Twitch',
    description: 'To mark this step as complete, log into your Twitch account in your browser.',
    subDescription: null,
    link: 'https://www.twitch.tv/login',
    linkLabel: 'Go to Twitch Login',
    steps: [
      ['Open the Twitch login page or press the button below.', require('../images/twitch_login_droid.png')],
      ['If you do not have an account, create one.', require('../images/twitch_login_signup_droid.png')],
      ['Enter your username and password.', ''],
      ['Click the "Log In" button.', require('../images/twitch_login_complete_droid.png')],
    ],
  },
  '2': {
    title: 'Check Amazon Prime Linkage to Twitch',
    description: 'To mark this step as complete, verify that your Twitch account is linked to Amazon Prime.',
    subDescription: null,
    link: 'https://gaming.amazon.com/links/twitch/manage',
    linkLabel: 'Go to Amazon Gaming Link Management',
    steps: [
      ['Open the Amazon Gaming link management page or press the button below.', require('../images/twitch_link_droid.png')],
      ['Open account menu.', require('../images/twitch_link_menu_droid.png')],
      ['Log In to your Amazon account.', require('../images/twitch_link_menu_amazon_droid.png')],
      ['Return to the Amazon Gaming link management page or press the button below.', require('../images/twitch_link_return_droid.png')],
      ['Press Connect to a Twitch account.', require('../images/twitch_link_connect_droid.png')],
      ['Confirm you are linking the Amazon account with Prime to the desired Twitch account.', require('../images/twitch_link_confirm_droid.png')],
    ],
  },
  '3': {
    title: 'Choose Preferred Channel',
    description: 'To mark this step as complete, confirm the channel in the preferred channel input is correct.',
    subDescription: 'The default channel listed is the creator of this app, To change it just replace the current channel name with the desired channel name.',
    link: 'https://www.twitch.tv/directory/following',
    linkLabel: 'Go to Followed Channels',
    steps: [
      ['One way to find a channel name is to check the channels you are following, if you are following any, by pressing the button below.',''],
      ['You can also browse the categories of live channels.',''],
      ['You can even pick someone from the front page of twitch.', ''],
    ],
  },
  '4': {
    title: 'Subscribe with Prime',
    description: 'To mark this step as complete, successfully subscribe to a channel using Twitch Prime.',
    subDescription: null,
    link: 'https://www.twitch.tv/subs/{channel_name}',
    linkLabel: 'Go to {channel_name}\'s Subscription Page',
    steps: [
      ['Open the subscription page for your chosen channel or press the button below.', ''],
      ['Scroll to bottom of the page.', ''],
      ['Check the "Use Prime Sub" checkbox.', require('../images/twitch_sub_prime_droid.png')],
      ['If there is no checkbox either there was a mistake on one of the previous tasks, or you used your prime within the last 30 days.', require('../images/twitch_sub_droid.png')],
      ['Press "Subscribe with Prime".', ''],
    ],
  },
};

export const TodoDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const task = taskInstructions[id as keyof typeof taskInstructions];
  const { markTaskComplete, tasks, updatePreferredChannel, preferredChannel } = useSubscription();
  const router = useRouter();
  const [buttonText, setButtonText] = useState(tasks[id as string] ? 'Complete' : 'Not Complete');
  const [buttonColor, setButtonColor] = useState(tasks[id as string] ? '#34C759' : '#8a1200');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<ImageSourcePropType | null>(null);
  const [channelName, setChannelName] = useState(preferredChannel);
  const [stepsVisible, setStepsVisible] = useState(false);
  const completeButtonRef = useRef<View>(null);

  useEffect(() => {
    setButtonText(tasks[id as string] ? 'Complete' : 'Not Complete');
    setButtonColor(tasks[id as string] ? '#34C759' : '#8a1200');
    setStepsVisible(false); // Hide instructions by default when the page is visited
  }, [tasks, id]);

  const handleCompleteStep = async () => {
    await markTaskComplete(id as string);
    setButtonText(tasks[id as string] ? 'Not Complete' : 'Complete');
    setButtonColor(tasks[id as string] ? '#8a1200' : '#34C759');
    if (id === '4' && !tasks['4']) {
      scheduleNotification(
        'Twitch Prime Subscription',
        'Your Twitch Prime subscription is now active!',
        { taskId: '4' },
        2592000 // 30 days
      );
    }
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
  };

  const toggleStepsVisibility = () => {
    setStepsVisible(!stepsVisible);
  };

  return (
    <ThemedView style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title} type="title">{task.title}</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer} 
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.descriptionContainer}>
            <ThemedText style={styles.description}>{task.description}</ThemedText>
          </View>

          {task.subDescription && (
            <View style={styles.descriptionContainer}>
              <ThemedText style={styles.description}>{task.subDescription}</ThemedText>
            </View>
          )}

          <TouchableOpacity onPress={toggleStepsVisibility} style={styles.moreInstructionsButton}>
            <Text style={styles.moreInstructionsButtonText}>
              {stepsVisible ? 'Hide Instructions' : 'Press here to get more instructions'}
            </Text>
          </TouchableOpacity>

          {stepsVisible && task.steps.map((step, index) => (
            <TouchableOpacity key={index} onPress={() => step[1] && handleImagePress(step[1])} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>{step[0]}</ThemedText>
              {step[1] && (
                <View style={styles.questionMarkButton}>
                  <Text style={styles.questionMarkText}>?</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {id === '3' && (
            <View style={styles.completeStepButton}>
              <View style={styles.channelInputContainer}>
                <View style={styles.channelInputLabelContainer}>
                  <ThemedText style={styles.channelInputLabel}>Preferred</ThemedText>
                  <ThemedText style={styles.channelInputLabel}>Channel</ThemedText>
                </View>
                <TextInput
                  style={styles.channelInput}
                  value={channelName}
                  onChangeText={handleChannelNameChange}
                  placeholder="Enter preferred channel name"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
          )}

          {task.link && (
            <View style={styles.linkButtonBubble}>
              <TouchableOpacity onPress={() => Linking.openURL(task.link.replace('{channel_name}', channelName))} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>{task.linkLabel.replace('{channel_name}', channelName)}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={handleCompleteStep} style={styles.completeStepButtonRow} ref={completeButtonRef}>
            <Text style={styles.completeStepButtonText}>Press this button when you have completed this step</Text>
            <View style={styles.completeButtonTextContainer}>
              <Text style={[styles.completeButtonText, { color: buttonColor }]}>
                {buttonText.split(' ').map((word, index) => (
                  <Text key={index}>{word}{index < buttonText.split(' ').length - 1 && '\n'}</Text>
                ))}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

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
    paddingBottom: '5%',
  },
  innerContainer: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 3,
    flex: 1,
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
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#357ABD',
    borderRadius: 10,
    padding: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelInputLabelContainer: {
    marginRight: 10,
  },
  channelInputLabel: {
    fontSize: 16,
    color: '#fff',
  },
  channelInput: {
    height: 40,
    borderColor: '#1E88E5',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#fff',
    flex: 1,
  },
  linkButton: {
    backgroundColor: '#00750e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
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
  completeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  completeButtonTextContainer: {
    width: '30%',
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
  moreInstructionsButton: {
    backgroundColor: '#00750e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    alignItems: 'center',
  },
  moreInstructionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeStepButton: {
    backgroundColor: '#357ABD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    alignItems: 'center',
  },
  completeStepButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 5,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  completeStepButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: '70%',
  },
  linkButtonBubble: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    alignItems: 'center',
  },
});
