//-- Developed by Carlos Delgado

import React, { Component } from 'react'
import { Image, View, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView  } from 'react-native'
import { Text, Avatar, withStyles, List } from 'react-native-ui-kitten'
import { withFirebaseHOC } from '../utils'

class _Feed extends Component {
    state = { DATA: null, isRefreshing: false }

    componentDidMount() {
        this.fetchPosts()
    }

    fetchPosts = async () => {
        try {
            const posts = await this.props.firebase.getPosts()
            console.log(posts)
            this.setState({ DATA: posts, isRefreshing: false })
        } catch (e) {
            console.error(e)
        }
    }

    onRefresh = () => {
        this.setState({ isRefreshing: true })
        this.fetchPosts()
    }

    render() {
        const renderItem = ({ item }) => (
            <View style={this.props.themedStyle.card}>
                <Image
                    source={{ uri: item.postPhoto.uri }}
                    style={this.props.themedStyle.cardImage}
                />
                <View style={this.props.themedStyle.cardHeader}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Profile')}>
                        <Avatar
                            source={{
                                uri:
                                    'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
                            }}
                            size='small'
                            style={this.props.themedStyle.cardAvatar}
                        />
                    </TouchableOpacity>
                    <Text category='p2'>{item.postDescription}</Text>
                </View>
            </View>
        )

        if (this.state.DATA != null) {
            return (
                <ScrollView style={styles.scrollView}>
                    <Text style={[styles.title]}>
                        Random Text
                    </Text>
                    <Text style={[styles.description]}>
                        Descripcion de este lugar, multilinea, usualmente tiene mas texto que los demas campos.
                    </Text>
                    <Text style={[styles.description, { paddingBottom: 10 }]}>
                        Has visitado este lugar n veces
                    </Text>
                    <List
                        style={this.props.themedStyle.container}
                        data={this.state.DATA}
                        renderItem={renderItem}
                        keyExtractor={this.state.DATA.id}
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.onRefresh()}
                    >
                    </List>
                </ScrollView>
            )
        } else
            return (
                <View
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            )
    }
}

export default Feed = withFirebaseHOC(
    withStyles(_Feed, theme => ({
        container: {
            flex: 1
        },
        card: {
            backgroundColor: theme['color-basic-100'],
            marginBottom: 25
        },
        cardImage: {
            width: '100%',
            height: 300
        },
        cardHeader: {
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        cardTitle: {
            color: theme['color-basic-1000']
        },
        cardAvatar: {
            marginRight: 16
        },
        cardContent: {
            padding: 10,
            borderWidth: 0.25,
            borderColor: theme['color-basic-600']
        }
    }))
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 5
    },
    description: {
        fontSize: 14,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5
    }
});