import React, { useEffect } from 'react';
import {
  Alert,
  AsyncStorage,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { colors, fonts, spacing } from '../themes';
import { getImage } from '../utils';
import i18n from '../services/i18nService';
import ExternalImage from '../components/ExternalImage';
import { getProfile } from '../redux/state/profile';
import { resetStore } from '../redux/state/root';

const { width } = Dimensions.get('window');

const profileScreen = ({ navigation, data, getUserInfo, resetState }) => {
  useEffect(() => {
    getUserInfo();
  }, []);

  async function logOut() {
    await resetState();
    navigation.navigate('InitialAuth');
    AsyncStorage.clear();
  }

  function sendAlert() {
    Alert.alert(i18n.t('loggingOut'), i18n.t('logoutConfirm'), [
      {
        text: i18n.t('cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: i18n.t('ok'), onPress: () => logOut() },
    ]);
  }

  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.headerBody}>
          <View style={styles.avatarContainer}>
            {data && data['profile-image'] ? (
              <ExternalImage
                style={styles.profileImage}
                source={getImage(data['profile-image'], 130, 130)}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarName}>
                  {data && data['first-name'] && data['first-name'].charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.headerContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{data && data['first-name']}</Text>
                <Text style={[styles.nameText, { marginLeft: spacing.xs }]}>
                  {data && data['last-name']}
                </Text>
              </View>
              <Text style={styles.info}>{data && data.job}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => sendAlert()} style={styles.profileEditButton}>
            <Text style={styles.profileEditText}>{i18n.t('logOut')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.underConstructionView}>
          <Text style={styles.underConstructionText}>
          {i18n.t('makingDashboard')}
          </Text>
          <ImageBackground
            style={styles.underConstructionImage}
            source={require('../assets/under-construction.png')}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginVertical: spacing.lg,
  },
  actionText: {
    color: colors.neutrals['900'],
    fontFamily: fonts.types.bold,
    fontSize: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.neutrals[600],
    borderColor: colors.neutrals['200'],
    borderRadius: 65,
    borderWidth: 6,
    height: 130,
    justifyContent: 'center',
    width: 130,
  },
  avatarContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  avatarName: {
    color: colors.neutrals[600],
    fontFamily: fonts.types.bold,
    fontSize: 36,
  },
  body: {
    marginHorizontal: spacing.md,
  },
  bodyTitle: {
    fontFamily: fonts.types.bold,
    fontSize: 24,
  },
  bodyTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  description: {
    fontFamily: fonts.types.regular,
    fontSize: 16,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  header: {
    backgroundColor: colors.neutrals['100'],
  },
  headerAction: { flexDirection: 'column', marginLeft: spacing.sm, marginRight: spacing.md },
  headerActionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.3333,
  },
  headerBody: {
    flexDirection: 'column',
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  info: {
    color: colors.neutrals['900'],
    fontFamily: fonts.types.regular,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  nameText: {
    color: colors.neutrals['900'],
    fontFamily: fonts.types.bold,
    fontSize: 18,
    fontWeight: '700',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileEditButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.neutrals['900'],
    justifyContent: 'center',
    marginLeft: spacing.md,
    marginBottom: spacing.lg,
    width: width * 0.8,
  },
  profileEditText: {
    color: colors.neutrals['900'],
    fontFamily: fonts.types.bold,
    marginVertical: spacing.xs,
  },
  profileImage: {
    borderColor: colors.neutrals[200],
    borderWidth: 6,
    borderRadius: 65,
    height: 130,
    width: 130,
  },
  underConstructionImage: {
    height: width * 0.6,
    width: width * 0.6,
  },
  underConstructionText: {
    fontFamily: fonts.types.bold,
    fontSize: 18,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  underConstructionView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

profileScreen.propTypes = {
  getUserInfo: PropTypes.func,
  data: PropTypes.shape({
    'profile-image': PropTypes.string,
    'first-name': PropTypes.string,
    'last-name': PropTypes.string,
    job: PropTypes.string,
  }),
  resetState: PropTypes.func,
};

profileScreen.defaultProps = {
  data: {},
  getUserInfo: null,
  resetState: null,
};

const mapStateToProps = state => {
  return { data: state.profile };
};

const mapDispatchToProps = dispatch => ({
  getUserInfo: () => dispatch(getProfile()),
  resetState: () => dispatch(resetStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(profileScreen);
