import React from 'react';
import { AsyncStorage, Modal, Platform, StyleSheet, View } from 'react-native';
import Constants from './utils/Constants';
import Feed from './screens/Feed';
import Comments from './screens/Comments';

const ASYNC_STORAGE_COMMENTS_KEY = 'ASYNC_STORAGE_COMMENTS_KEY';

const TAG = 'App.js';
class App extends React.Component {
  state = {
    commentsForItem: {},
    selectedItemId: null,
    showModal: false,
  };

  async componentDidMount() {
    try {
      const commentsForItem = await AsyncStorage.getItem(
        ASYNC_STORAGE_COMMENTS_KEY,
      );
      /**
       commentsForItem = {"1":["Comment1","C2"]}
       */
      console.log(TAG, 'componentDidMount commentsForItem:', commentsForItem);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        commentsForItem: commentsForItem ? JSON.parse(commentsForItem) : {},
      });
    } catch (error) {
      console.log('Failed to load comments');
    }
  }

  closeCommentScreen = () => {
    this.setState({
      selectedItemId: null,
      showModal: false,
    });
  };

  onSubmitComment = (text) => {
    const { commentsForItem, selectedItemId } = this.state;
    console.log(TAG, 'onSubmitComment commentsForItem:', commentsForItem);
    const comments = commentsForItem[selectedItemId] || [];
    console.log(TAG, 'onSubmitComment comments:', comments);
    console.log(TAG, 'onSubmitComment ...commentsForItem:', commentsForItem);
    console.log(TAG, 'onSubmitComment [selectedItemId]', [selectedItemId]);
    console.log(TAG, 'onSubmitComment [...comments, text]', [...comments, text]);
    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text],
    };
    console.log(TAG, 'onSubmitComment updated:', updated);
    this.setState({ commentsForItem: updated });
    try {
      AsyncStorage.setItem(ASYNC_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Failed to save comment', text, 'for', selectedItemId);
    }
  };

  openCommentScreen = (id) => {
    this.setState({
      selectedItemId: id,
      showModal: true,
    });
  };

  render() {
    const { commentsForItem, selectedItemId, showModal } = this.state;
    const items = [
      {
        id: 0,
        author: 'Bob Ross',
      },
      {
        id: 1,
        author: 'Chuck Norris',
      },
    ];

    console.log(TAG, 'render commentsForItem:', commentsForItem);

    return (
      <View style={styles.container}>
        <Feed
          commentsForItem={commentsForItem} // null || [] {"1":["Comment1","C2"]}
          onPressComments={this.openCommentScreen}
          style={styles.feed}
        />
        <Modal
          animationType='slide'
          onRequestClose={this.closeCommentScreen}
          visible={showModal}
        >
          <Comments
            comments={commentsForItem[selectedItemId] || []}
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
            style={styles.container}
          />
        </Modal>
      </View>
    );
  }
}

const platformVersion = Platform.OS === 'ios' ? parseInt(Platform.Version, 10) : Platform.Version;

const styles = StyleSheet.create({
  comments: {
    flex: 1,
    marginTop: Platform.OS === 'ios' && platformVersion < 11
      ? Constants.statusBarHeight
      : 0,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  feed: {
    flex: 1,
    marginTop: Platform.OS === 'android' || platformVersion < 11 ? Constants.statusBarHeight : 0,
  },
});

export default App;
