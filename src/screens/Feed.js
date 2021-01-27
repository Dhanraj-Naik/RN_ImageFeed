import {
    ActivityIndicator,
    Text,
    ViewPropTypes,
    SafeAreaView,
    View
} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { fetchImages } from '../utils/api';
import CardList from '../components/CardList';

const TAG = 'Feed.js';
class Feed extends Component {
    static propTypes = {
        commentsForItem: PropTypes.objectOf(
            PropTypes.arrayOf(
                PropTypes.string
            )
        ).isRequired,
        onPressComments: PropTypes.func.isRequired,
        style: ViewPropTypes.style,
    };
    static defaultProps = {
        style: null,
    };

    state = {
        loading: true,
        error: false,
        items: [],
    };

    async componentDidMount() {
        try {
            const items = await fetchImages();

            console.log(TAG, 'componentDidMount: items', items);
            /*
            item =
            [
              {
                "format": "jpeg",
                "width": 5760,
                "height": 3840,
                "filename": "861.jpeg",
                "id": 861,
                "author": "Pablo GarciaSaldaña",
                "author_url": "https://unsplash.com/photos/jtyIeXi1Goc",
                "post_url": "https://unsplash.com/photos/jtyIeXi1Goc"
                },
                ...
            ]
            */

            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                loading: false,
                items,
            });
        } catch (error) {
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({
                loading: false,
                error: true,
            });
        }
    }

    render() {
        const { commentsForItem, onPressComments, style } = this.props;
        const { loading, error, items } = this.state;
        console.log(TAG, 'commentsForItem:', commentsForItem);
        // console.log(TAG, 'this.state.items:', this.state.items);
        if (loading) {
            <ActivityIndicator size='large' />;
        }
        if (error) {
            return <Text>Error...</Text>;
        }
        return (
            <SafeAreaView style={style}>
                <CardList
                    commentsForItem={commentsForItem}
                    items={items}
                    onPressComments={onPressComments}
                />
            </SafeAreaView>
        );
    }
}

export default Feed;
