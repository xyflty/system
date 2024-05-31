<template>
  <div class="app-container">
    <div class="topTitle">
      <div
        :class="['topTitleList', type == 1 ? 'topTitleListR' : '']"
        style="width: 100px"
        @click="type = 1"
      >
        线索分析
      </div>
      <div v-show="type == 1" class="po"></div>
      <div
        :class="['topTitleList', type == 2 ? 'topTitleListR' : '']"
        style="width: 100px"
        @click="type = 2"
      >
        商机分析
      </div>
      <div v-show="type == 2" class="po"></div>
      <div
        :class="['topTitleList', type == 3 ? 'topTitleListR' : '']"
        style="width: 100px"
        @click="type = 3"
      >
        订单分析
      </div>
      <div v-show="type == 3" class="po"></div>
    </div>

    <div class="PerformanceData-sea">
      <el-card class="box-card">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
        >
          <el-form-item label="" prop="timeType">
            <el-select v-model="timeType">
              <el-option label="按年统计" :value="1" />
              <el-option label="按月统计" :value="2" />
              <el-option label="按周统计" :value="3" />
              <el-option label="按日统计" :value="4" />
              <!-- <el-option label="按年统计" :value="3" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="timeValueBegin">
            <el-date-picker
              v-if="timeType == 1"
              v-model="queryParams.timeValueBegin"
              value-format="yyyy"
              type="year"
              placeholder="开始年份"
              :clearable="false"
              :editable="false"
            >
            </el-date-picker>
            <el-date-picker
              v-if="timeType != 1 && timeType != 3"
              v-model="dateMonth"
              :type="pickerType"
              :value-format="valueFormat"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :editable="false"
            />
          </el-form-item>
          <!-- 这是周的选择日期 -->
          <el-form-item label="" v-if="timeType == 3" prop="">
            <Chooseweek ref="Chooseweek" @sallBusiness="date"></Chooseweek>
          </el-form-item>

          <el-form-item label="" prop="timeValueEnd">
            <el-date-picker
              v-if="timeType == 1"
              v-model="queryParams.timeValueEnd"
              type="year"
              value-format="yyyy"
              placeholder="结束年份"
              :clearable="false"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="showDepartSelect == true" label="" prop="deptIds">
            <treeselect
              @input="treeselectinput"
              :flat="true"
              v-model="getTreeselectArr1"
              appendToBody
              style="margin-left: 10px; max-width: 400px"
              :multiple="true"
              :options="deptOptions"
              value-consists-of="ALL"
              :show-count="true"
              :clearable="false"
              placeholder="请选择归属部门"
            />
          </el-form-item>

          <el-form-item label="" prop="userId">
            <el-select
              :disabled="!showList"
              style="width: 100%"
              v-model="queryParams.userId"
              filterable
              placeholder="请输入关键字搜索用户"
              remote
              @input="selectInput"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery1"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery1"
              >重置</el-button
            >
            <el-button
              v-if="showBack == true"
              icon="el-icon-back"
              type="primary"
              @click="goBack"
              >返回</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="PerformanceData-tit">{{ tableTitle[0] }}</div>
    <div class="PerformanceData-data">
      <el-card v-if="type == 1" style="margin-top: 20px" v-loading="loading1">
        <div class="menu-box">
          <div
            v-for="(item, index) in tabData[0]"
            :key="index"
            class="text item"
          >
            <div>{{ item.lable }}</div>
            <div
              style="
                display: inline-block;
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ item.value || "" }}
            </div>
          </div>
        </div>
      </el-card>
      <el-card v-if="type == 2" style="margin-top: 20px" v-loading="loading1">
        <div class="menu-box">
          <div
            v-for="(item, index) in tabData1[0]"
            :key="index"
            class="text item"
          >
            <div>{{ item.lable }}</div>
            <div
              style="
                display: inline-block;
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ item.value || "" }}
            </div>
          </div>
        </div>
      </el-card>
      <el-card v-if="type == 3" style="margin-top: 20px" v-loading="loading1">
        <div class="menu-box">
          <div
            v-for="(item, index) in tabData2[0]"
            :key="index"
            class="text item"
          >
            <div>{{ item.lable }}</div>
            <div
              style="
                display: inline-block;
                white-space: nowrap;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ item.value || "" }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="PerformanceData-echar">
      <el-row v-if="type == 1" :gutter="10">
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="type == 3 ? 6 : showDepartment == true ? 8 : 12"
          :xl="type == 3 ? 6 : showDepartment == true ? 8 : 12"
        >
          <el-card v-if="this.echartsData[0]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[0] }}</span>
              <el-button
                type="primary"
                size="mini"
                @click="handleClick({ type: 1 })"
                >钻取</el-button
              >
            </div>
            <pieChart
              :margin="showDepartment == true ? '' : 'auto'"
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              height="360px"
              :initData="echartData1"
              :num="1"
            />
          </el-card>
        </el-col>
        <el-col
          v-if="showDepartment == true"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="type == 3 ? 6 : 8"
          :xl="type == 3 ? 6 : 8"
        >
          <el-card v-if="this.echartsData[1]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[1] }}</span>
            </div>
            <pieChart height="360px" :initData="echartData2" />
          </el-card>
        </el-col>
        <!-- <el-card v-if="this.echartsData[2]" v-loading="loading2">
          <div class="flextop">
            <span>{{ this.echartsData[2] }}</span>
            <el-button type="primary" size="mini">钻取</el-button>
          </div>
          <pieChart height="360px" :initData="echartData3" />
        </el-card> -->
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="type == 3 ? 6 : showDepartment == true ? 8 : 12"
          :xl="type == 3 ? 6 : showDepartment == true ? 8 : 12"
        >
          <el-card v-if="this.echartsData[3]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[3] }}</span>
              <el-button
                @click="handleClick({ type: 10 })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </div>
            <pieChart
              :margin="showDepartment == true ? '' : 'auto'"
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              :num="2"
              height="360px"
              :initData="echartData4"
            />
          </el-card>
        </el-col>
      </el-row>

      <el-row v-if="type == 2" style="margin: 20px 0px" :gutter="10">
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="showDepartment == true ? 6 : 8"
          :xl="showDepartment == true ? 6 : 8"
        >
          <el-card v-if="this.echartsData[0]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[0] }}</span>
              <el-button
                type="primary"
                size="mini"
                @click="handleClick({ type: 1 })"
                >钻取</el-button
              >
            </div>
            <pieChart1
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              :initData="echartData1"
              :num="1"
            />
          </el-card>
        </el-col>
        <el-col
          v-if="showDepartment == true"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="6"
          :xl="6"
        >
          <el-card v-if="this.echartsData[1]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[1] }}</span>
            </div>
            <pieChart1 :initData="echartData2" />
          </el-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="showDepartment == true ? 6 : 8"
          :xl="showDepartment == true ? 6 : 8"
        >
          <el-card v-if="this.echartsData[3]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[3] }}</span>
              <el-button
                @click="handleClick({ type: 10 })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </div>
            <pieChart1
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              :num="2"
              :initData="echartData4"
            />
          </el-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="showDepartment == true ? 6 : 8"
          :xl="showDepartment == true ? 6 : 8"
        >
          <div>
            <el-card v-loading="loading3">
              <div class="flextop">
                <span>{{ this.echartsData[5] }}</span>
                <el-button
                  v-if="type == 3"
                  @click="handleClick({ type: 12 })"
                  type="primary"
                  size="mini"
                  >钻取</el-button
                >
                <el-button
                  @click="handleClick({ type: 14 })"
                  v-if="type == 2"
                  type="primary"
                  size="mini"
                  >钻取</el-button
                >
              </div>
              <div>
                <pieChart1
                  :queryParams="queryParams"
                  :depID="queryParams.deptId"
                  :userId="queryParams.userId"
                  :chil="true"
                  :num="3"
                  :initData="echartData6"
                />
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="type == 3" style="margin: 20px 0px" :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-card v-if="this.echartsData[0]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[0] }}</span>
              <el-button
                type="primary"
                size="mini"
                @click="handleClick({ type: 1 })"
                >钻取</el-button
              >
            </div>
            <pieChart1
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              :initData="echartData1"
              :num="1"
            />
          </el-card>
        </el-col>
        <!-- <el-col v-if="showDepartment == true" :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <el-card v-if="this.echartsData[1]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[1] }}</span>
            </div>
            <pieChart1 :initData="echartData2" />
          </el-card>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-card v-if="this.echartsData[3]" v-loading="loading2">
            <div class="flextop">
              <span>{{ this.echartsData[3] }}</span>
              <el-button
                @click="handleClick({ type: 10 })"
                type="primary"
                size="mini"
                >钻取</el-button
              >
            </div>
            <pieChart1
              :queryParams="queryParams"
              :depID="queryParams.deptId"
              :userId="queryParams.userId"
              :chil="true"
              :num="2"
              :initData="echartData4"
            />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div>
            <el-card v-loading="loading3">
              <div class="flextop">
                <span>{{ this.echartsData[5] }}</span>
                <el-button
                  v-if="type == 3"
                  @click="handleClick({ type: 12 })"
                  type="primary"
                  size="mini"
                  >钻取</el-button
                >
                <el-button
                  @click="handleClick({ type: 14 })"
                  v-if="type == 2"
                  type="primary"
                  size="mini"
                  >钻取</el-button
                >
              </div>
              <div>
                <pieChart1
                  :queryParams="queryParams"
                  :depID="queryParams.deptId"
                  :userId="queryParams.userId"
                  :chil="true"
                  :num="4"
                  :initData="echartData6"
                />
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row v-if="false" :gutter="10">
        <el-col v-if="type == 2" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div>
            <el-card v-loading="loading3">
              <div style="float: right" class="flextop">
                <el-button type="primary" size="mini">钻取</el-button>
              </div>
              <div style="display: flex">
                <div style="flex: 1" v-if="this.echartsData[4]">
                  <span>{{ this.echartsData[4] }}</span>
                  <funnelChart :type="true" :initData="echartData5" />
                </div>
                <div style="flex: 1" v-if="this.echartsData[5]">
                  <span>{{ this.echartsData[5] }}</span>
                  <pieChart :initData="echartData6" />
                </div>
              </div>
            </el-card>
          </div>
        </el-col>

        <el-col v-if="type == 2" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div>
            <el-card v-if="this.echartsData[6]" v-loading="loading5">
              <div class="flextop">
                <span>{{ this.echartsData[6] }}</span>
                <el-button type="primary" size="mini">钻取</el-button>
              </div>
              <treeChart className="chart2" :initData="echartData7" />
            </el-card>
          </div>
        </el-col>
        <el-col v-if="type == 3" :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
          <div>
            <el-card v-if="this.echartsData[6]" v-loading="loading5">
              <div class="flextop">
                <span>{{ this.echartsData[6] }}</span>
                <el-button type="primary" size="mini">钻取</el-button>
              </div>
              <treeChart1 className="chart1" :initData="echartData7" />
            </el-card>
          </div>
        </el-col>
      </el-row> -->
    </div>
    <div v-if="type == 1" class="PerformanceData-table">
      <el-card v-show="queryParams.deptIds" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 线索详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>
        <el-table
          :key="879"
          @sort-change="sortChange"
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          :default-sort="{ prop: 'clueCount', order: 'descending' }"
        >
          <el-table-column prop="" type="index" label="排名" align="center" />

          <el-table-column align="center" :label="deptName">
            <template slot-scope="{ row }">
              {{ row.deptName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="职务"
          >
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="姓名"
            prop="userName"
          >
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="线索数量"
            prop="clueCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 5,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    userName: row.userName,
                  })
                "
                class="ableClick"
                >{{ row.clueCount }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="clueCount"
            label="线索数量占比"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.clueCountRate || 0 }}%
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="clueIncreaseRate"
            label="线索环比增长率"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.clueIncreaseRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="opportunityCount"
            label="转商机数量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 6,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.opportunityCount || 0 }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="转商机转化率"
            sortable="custom"
            prop="opportunityTransRate"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityTransRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转订单数量"
            prop="orderCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 7,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.orderCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转订单转化率"
            prop="orderTransRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderTransRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转客户数量"
            prop="customerCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <!-- <productList
                :row="row"
                :queryParams="queryParams"
                :val="row.customerCount || 0"
              ></productList> -->
              <span @click="getCountList(row)" class="ableClick">{{
                row.customerCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转客户转化率"
            prop="customerTransRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.customerTransRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="referralDealCount"
            label="转介绍成交数量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 9,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.referralDealCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="clueQuality"
            label="线索质量"
            align="center"
            sortable="custom"
          />
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop=""
            width="100"
            fixed="right"
            label="钻取分析"
          >
            <template slot-scope="{ row }">
              <el-button @click="DrillingM(row)" type="primary" size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <el-card v-show="queryParams.userId" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 线索详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          @sort-change="sortChange"
        >
          <el-table-column align="center" label="线索名称">
            <template slot-scope="{ row }">
              {{ row.clueName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数据来源">
            <template slot-scope="{ row }">
              {{ row.dataSourceString || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进方式">
            <template slot-scope="{ row }">
              {{ typeM[row.dataSource] || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="转商机标题">
            <template slot-scope="{ row }">
              {{ row.opportunityTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="转订单标题">
            <template slot-scope="{ row }">
              {{ row.orderTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单金额"
            prop="orderPrice"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderPrice || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="关联客户">
            <template slot-scope="{ row }">
              {{ row.referralCustomerName || row.clueName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转介绍成交数量"
            prop="referralDealCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 9,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.referralDealCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数 "
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.unFollowUpDay || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="最近跟进时间"
            prop="lastFollowUpTime"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.lastFollowUpTime || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
    </div>
    <div v-if="type == 2" class="PerformanceData-table">
      <el-card v-if="queryParams.deptIds" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 商机详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>
        <el-table
          :key="877"
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          @sort-change="sortChange"
          :default-sort="{ prop: 'opportunityCount', order: 'descending' }"
        >
          <el-table-column prop="" type="index" label="排名" align="center" />

          <el-table-column align="center" :label="deptName">
            <template slot-scope="{ row }">
              {{ row.deptName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="职务"
          >
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="姓名"
          >
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商机数量"
            prop="opportunityCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 6,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    namesang: '商机数量',
                  })
                "
                class="ableClick"
                >{{ row.opportunityCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="opportunityCount"
            label="商机数量占比"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityCountRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商机环比增长率"
            prop="opportunityIncreaseRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityIncreaseRate || 0 }}%
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="转订单数量"
            prop="orderCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 7,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.orderCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转订单转化率"
            prop="orderTransRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderTransRate || 0 }} %
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转客户数量"
            prop="customerCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <!-- <productList
                :row="row"
                :queryParams="queryParams"
                :val="row.customerCount || 0"
              ></productList> -->
              <span @click="getCountList(row)" class="ableClick">{{
                row.customerCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转客户转化率"
            prop="customerTransRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.customerTransRate || 0 }}%
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转介绍成交数量"
            prop="referralDealCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 9,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.referralDealCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="商机质量"
            prop="opportunityQuality"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.opportunityQuality || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="流失商机"
            prop="lossOpportunityCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 6,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    namesang: '流失商机',
                    isLoss: 1,
                  })
                "
                class="ableClick"
                >{{ row.lossOpportunityCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联产品数"
            prop="associatedProductCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span @click="handleClickLisr(row)" class="ableClick">{{
                row.associatedProductCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop=""
            width="100"
            fixed="right"
            label="钻取分析"
          >
            <template slot-scope="{ row }">
              <el-button @click="DrillingM(row)" type="primary" size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
      <el-card v-if="queryParams.userId" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 商机详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>
        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          @sort-change="sortChange"
        >
          <el-table-column align="center" label="商机名称">
            <template slot-scope="{ row }">
              {{ row.opportunityTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业名称">
            <template slot-scope="{ row }">
              {{ row.customerName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数据来源">
            <template slot-scope="{ row }">
              {{ row.dataSourceString || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进方式">
            <template slot-scope="{ row }">
              {{ typeM[row.dataSource] || "暂无" }}
            </template>
          </el-table-column>

          <!-- <el-table-column
            align="center"
            label="转订单数量"
            prop="orderCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 7,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.orderCount || 0 }}</span
              >
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="转介绍成交数量"
            prop="referralDealCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 9,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.referralDealCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联产品数"
            prop="associatedProductCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span @click="handleClickLisr(row)" class="ableClick">{{
                row.associatedProductCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="未跟进天数"
            prop="unFollowUpDay"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.unFollowUpDay || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
    </div>
    <div v-if="type == 3" class="PerformanceData-table">
      <el-card v-if="queryParams.deptIds" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 订单详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>
        <el-table
          :key="999"
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          @sort-change="sortChange"
          :default-sort="{ prop: 'orderCount', order: 'descending' }"
        >
          <el-table-column prop="" type="index" label="排名" align="center" />

          <el-table-column align="center" :label="deptName">
            <template slot-scope="{ row }">
              {{ row.deptName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="职务"
          >
            <template slot-scope="{ row }">
              {{ row.postName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="deptName == '部门'"
            align="center"
            label="姓名"
          >
            <template slot-scope="{ row }">
              {{ row.userName || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单数量"
            prop="orderCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 7,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                  })
                "
                class="ableClick"
                >{{ row.orderCount || 0 }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="orderCount"
            label="订单数量占比"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderCountRate || 0 }}%
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单环比增长率"
            prop="orderIncreaseRate"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderIncreaseRate || 0 }}%
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单金额"
            prop="orderAmount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderAmount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="平均订单金额"
            prop="avgOrderAmount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.avgOrderAmount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转客户数量"
            prop="customerCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <!-- <productList
                :row="row"
                :queryParams="queryParams"
                :val="row.customerCount || 0"
              ></productList> -->
              <span @click="getCountList(row)" class="ableClick">{{
                row.customerCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联产品数"
            prop="associatedProductCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span @click="handleClickLisr(row)" class="ableClick">{{
                row.associatedProductCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop=""
            width="100"
            fixed="right"
            label="钻取分析"
          >
            <template slot-scope="{ row }">
              <el-button @click="DrillingM(row)" type="primary" size="mini"
                >钻取</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>

      <el-card v-if="queryParams.userId" style="margin-top: 20px">
        <div slot="header" class="header-box">
          <div class="msg-box2">
            <span> 订单详情 </span>
          </div>
          <!-- <el-button
            plain
            @click="handleExport"
            v-hasPermi="['zw:customerAnalysis:export']"
            >导出数据</el-button
          > -->
        </div>

        <el-table
          :data="list"
          stripe
          style="width: 100%"
          border
          v-loading="loading4"
          @sort-change="sortChange"
        >
          <el-table-column align="center" label="订单名称">
            <template slot-scope="{ row }">
              {{ row.orderTitle || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="企业名称">
            <template slot-scope="{ row }">
              {{ row.companyName || 0 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数据来源">
            <template slot-scope="{ row }">
              {{
                commonData.dataSourceList[row.dataSource]
                  ? commonData.dataSourceList[row.dataSource].label
                  : "暂无"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="跟进方式">
            <template slot-scope="{ row }">
              {{ typeM[row.followUpMethod] || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="订单金额"
            prop="orderPrice"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.orderPrice || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联产品数"
            prop="associatedProductCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span @click="handleClickLisr(row)" class="ableClick">{{
                row.associatedProductCount || 0
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进次数"
            prop="followUpCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进内容量"
            prop="followUpContentCount"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span
                @click="
                  handleClick({
                    type: 4,
                    archiveId: row.archiveId,
                    deptId: row.deptId,
                    userId: row.userId,
                    clueName:
                      row.clueName ||
                      row.userName ||
                      row.companyName ||
                      row.deptName,
                  })
                "
                class="ableClick"
                >{{ row.followUpContentCount || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="跟进密度"
            prop="followUpDensity"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.followUpDensity || 0 }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
          :autoScroll="false"
        />
      </el-card>
    </div>
    <productList
      ref="productList"
      :ifDIO="false"
      :queryParams="queryParams"
    ></productList>
  </div>
</template>

<script>
import mixin from "./minxin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getDetailTopData,
  getIndexPieChar,
  getDetailUserList,
  getDetailDeptUserList,
  getClueDetailDeptList,
  getOpportunityDetailTopData,
  getOpportunityDetailPieChar,
  getOpportunityProjectMatrixChartVo,
  getOpportunityStatusPieChart,
  getOpportunityDetailUserList,
  getOpportunityDetailDeptList,
  getOrderDetailTopData,
  getOrderDetailPieChart,
  getOrderDetailMatrixChart,
  getOrderDetailBottomDeptList,
  getOrderDetailBottomUserList,
  getOrderPieChart,
  getOrderDetailDeptList,
  getOrderDetailDeptUserList,
  getOrderDetailUserList,
  getOpportunityDetailDeptUserList,
  getOrderProject,
  deptJumpEmployeesList,
} from "@/api/newreport/analyse";
import pieChart from "../components/chart/pie.vue";
import pieChart1 from "../components/chart/pie1.vue";
import treeChart from "newreport/chart/tree.vue";
import treeChart1 from "newreport/chart/tree1.vue";
import funnelChart from "newreport/chart/funnel.vue";
import productList from "./productList.vue";
import Chooseweek from "@/components/Chooseweek/weeks1.vue";
import { mapState } from "vuex";
import { treeselect } from "@/api/system/dept";
import { filterDepts } from "@/utils/common";

export default {
  name: "PerformanceData",
  components: {
    Treeselect,
    pieChart,
    treeChart,
    funnelChart,
    treeChart1,
    pieChart1,
    productList,
    Chooseweek,
  },

  mixins: [mixin],
  computed: {
    ...mapState("commonData", {
      commonData: (state) => state.commonData,
    }),
  },
  watch: {
    $route: {
      handler() {
        this.queryParams.timeType = this.$route.query.timeType;
        this.queryParams.deptIds = this.$route.query.deptId;
        this.queryParams.timeValueBegin = this.$route.query.timeValueBegin;
        this.queryParams.timeValueEnd = this.$route.query.timeValueEnd;
        this.queryParams.userId = this.$route.query.userId;
        this.showQuery = true;

        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });
        if (this.queryParams.userId) {
          this.queryParams.deptId = undefined;
          this.queryParams.deptIds = undefined;
          this.getTreeselectArr1 = [];
          this.queryParams.userId = this.queryParams.userId;
        }
        if (this.datesDataType == 1) {
          this.setStartYear = this.queryParams.timeValueBegin;
          this.setEndYear = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 2) {
          this.setStartMonth = this.queryParams.timeValueBegin;
          this.setEndMonth = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 4) {
          this.setStartDay = this.queryParams.timeValueBegin;
          this.setEndDay = this.queryParams.timeValueEnd;
        }
        this.$nextTick(() => {
          if (this.timeType == 3) {
            this.$refs.Chooseweek.getMont(this.queryParams.timeValueBegin);
          }
        });

        // 在点击进入钻取后点击左侧按钮会触发这里的监听导致数据为空
        if (this.queryParams.timeValueBegin == undefined) {
          this.queryParams.timeValueBegin = "2023";
          this.queryParams.timeValueEnd = "2023";
          this.queryParams.timeType = 1;
          this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
          this.storageData = null;
          sessionStorage.setItem(
            "storageDatas",
            JSON.stringify(this.storageData)
          );
          this.getTreeselect();
          this.typechanging();
        } else {
          this.routerchanging();
          this.getDetailTopData();
          this.getIndexPieChar();
          this.getList();
        }
      },
      deep: true,
      // immediate:true, //立即执行
    },
    type: {
      handler(val) {
        this.queryParams.orderByColumn = undefined;
        this.queryParams.isAsc = undefined;
        this.type = val;
        this.typechanging();
        this.handleQuery1();
      },
    },
    timeType: {
      handler(n) {
        this.queryParams.timeType = this.timeType == 4 ? 3 : this.timeType;

        if (n == 1) {
          if (this.setStartYear !== undefined) {
            (this.queryParams.timeValueBegin = this.setStartYear),
              (this.queryParams.timeValueEnd = this.setEndYear);
          } else {
            this.dateMonth = ["2023", "2023"];
          }
        } else if (n == 3) {
        } else {
          this.pickerType = n == 2 ? "monthrange" : "daterange";
          this.valueFormat = n == 2 ? "yyyy-MM" : "yyyy-MM-dd";

          if (n == 2) {
            if (this.setStartMonth !== undefined) {
              this.dateMonth = [this.setStartMonth, this.setEndMonth];
            } else {
              this.dateMonth = ["2023-01", "2023-01"];
            }
          } else {
            if (this.setStartDay !== undefined) {
              this.dateMonth = [this.setStartDay, this.setEndDay];
            } else {
              this.dateMonth = ["2023-01-01", "2023-01-01"];
            }
          }
        }
      },
      deep: true,
      immediate: true, //立即执行
    },
  },
  data() {
    return {
      tableTitle: [0, 0],
      echartsData: [0, 0, 0, 0, 0, 0, 0],
      type: 1,
      sonData: [],
      loading1: false,
      // echarts
      loading2: false,
      loading3: false,
      // table
      loading4: false,
      loading5: false,
      list: [],
      echartData1: [],
      echartData2: [],
      echartData3: [],
      echartData4: [],
      echartData5: [],
      echartData6: [],
      echartData7: [],
      deptOptions: [],
      deptName: "部门",
      timeType: 1,
      // treeselect里获取id的方法
      jumpData: [], // 存取拿到后的新id
      childrenArr: [], // 拿到对于元素的子数组
      idArr: [], // 拿到对于元素的子id
      sonData: "", // 存储第一遍id
      childData: "", // 存储第一遍子数组
      goBackPage: "", // 存储从上一页面拿到数据，方便返回使用
      onePageBack: "", // 这是点击原页面跳转的数据，同上
      storageData: [], // session
      previousRouterName: "",
      dateDatas1: "",
      dateDatas2: "",
      setTimeType: "",
      datesDataType: "",
      setData: "",
      setDataYear: "",
      setDataDay: "",
      queryParams: {
        userId: "",
        timeType: 1,
        timeValueBegin: "2023",
        timeValueEnd: "2023",
        pageNum: 1,
        pageSize: 10,
        deptIds: "",
      },
      showDepartment: true, // 在进入到人员详情页面时对部门线索占比扇形图进行隐藏
      showBack: true, // 控制显示返回按钮，当前页面是第一层时对页面进行隐藏
      ableClear: true, // 控制是否可以删除用户，当用户进来时没有部门 是最低层时，对部门进行隐藏 固定当前用户且无法删除
      showDepartSelect: true, // 当用户出现时部门筛选框消失
      showList: null,
      showQuery: false,
      setStartYear: undefined,
      setEndYear: undefined,
      setStartMonth: undefined,
      setEndMonth: undefined,
      setStartDay: undefined,
      setEndDay: undefined,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.previousRouterName = from.name;
    });
  },
  created() {
    this.queryParams.orderByColumn = undefined;
    this.queryParams.isAsc = undefined;
    this.getTreeselect();
    this.typechanging();
  },
  mounted() {
    //  判断是否从Detailed页面进入，來判斷是否取出session里面的值
    if (this.previousRouterName == "Detailed") {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.queryParams = this.storageData.pop();
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      this.timeType = this.queryParams.setTimeType;

      this.dateDatas1 = this.queryParams.timeValueBegin;
      this.dateDatas2 = this.queryParams.timeValueEnd;
      this.datesDataType = this.queryParams.timeType;
      if (this.queryParams.userId) {
        this.showDepartment = false;
      }

      if (this.datesDataType == 1) {
        this.setDataYear = [this.dateDatas1, this.dateDatas2];
      }
      if (this.datesDataType == 2) {
        this.setData = [this.dateDatas1, this.dateDatas2];
      }
      if (this.datesDataType == 4) {
        this.setDataDay = [this.dateDatas1, this.dateDatas2];
      }

      if (this.queryParams.deptIds) {
        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            // 对变量类型进行转换 不转换的话无法删除部门的第一项
            if (i == 200 || i == 100) {
              return Number(i);
            } else {
              return i;
            }
          });
      }
    }

    this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));

    if (this.storageData == null || this.storageData.length == 0) {
      if (this.$route.query.timeType) {
        // 获取当前页面 URL
        const currentUrl = window.location.href;

        // 清空查询参数
        const newUrl = currentUrl.split("?")[0]; // 只保留问号之前的部分

        // 通过修改 URL 来实现页面重定向
        window.location.href = newUrl;
      }

      this.showBack = false;
    } else {
      this.showBack = true;
    }

    this.$nextTick(() => {
      if (this.timeType == 3) {
        if (this.dateDatas1 !== "") {
          this.$refs.Chooseweek.getMont(this.dateDatas1);
        } else {
          this.$refs.Chooseweek.getMont(this.queryParams.timeValueBegin);
        }
      }
    });

    /**当用户id存在时则不再使用deptId */
    if (this.queryParams.userId) {
      this.queryParams.deptId = undefined;
      this.queryParams.deptIds = undefined;
      this.getTreeselectArr1 = [];
      this.queryParams.userId = this.queryParams.userId;
    }

    /** 因为从 Detailed 页面返回时在显示所有人员页面会出现丢失数据 只有部门
     *  假如判断从 Detailed 进入时给延迟执行保证数据获取的是想要的数据
     */
    // if (this.previousRouterName == 'Detailed') {
    //   setTimeout(() => {
    //     this.getList();
    //   }, 500)
    // } else {
    //   // this.getList();
    // }
  },

  methods: {
    // 转客户
    getCountList(row) {
      this.$router.push({
        name: "TurnClient",
        query: {
          ...this.queryParams,
          deptId: row.deptId,
          userId: row.userId,
          archiveId: row.archiveId,
        },
      });
    },
    // 关联产品数
    handleClickLisr(row) {
      this.$router.push({
        name: "AnalyseRelevancyProduct",
        query: {
          ...this.queryParams,
          deptId: row.deptId,
          userId: row.userId,
          orderStatus: row.orderStatus,
          orderId: row.orderId,
          archiveId: row.archiveId,
        },
      });
    },

    getTreeselect() {
      /**
       *     获取当前登录用户信息进行判断，部门存在则正常显示部门，否则隐藏部门，接收并固定userId 无法删除
       */

      //  在页面刷新时从这里获取query的值，因为当前页面是单页面跳转，深入监听无法触发，只能从这里获取路由的值

      if (this.$route.query.timeType) {
        this.queryParams.timeType = this.$route.query.timeType;
        this.queryParams.timeType = Number(this.queryParams.timeType);
        this.queryParams.deptIds = this.$route.query.deptId;

        this.queryParams.timeValueBegin = this.$route.query.timeValueBegin;
        this.queryParams.timeValueEnd = this.$route.query.timeValueEnd;
        this.queryParams.userId = this.$route.query.userId;
        this.showQuery = true;
        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });
        if (this.queryParams.userId) {
          this.queryParams.deptId = undefined;
          this.queryParams.deptIds = undefined;
          this.getTreeselectArr1 = [];
          this.queryParams.userId = this.queryParams.userId;
        }
        if (this.datesDataType == 1) {
          this.setStartYear = this.queryParams.timeValueBegin;
          this.setEndYear = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 2) {
          this.setStartMonth = this.queryParams.timeValueBegin;
          this.setEndMonth = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 4) {
          this.setStartDay = this.queryParams.timeValueBegin;
          this.setEndDay = this.queryParams.timeValueEnd;
        }
        this.$nextTick(() => {
          if (this.timeType == 3) {
            this.$refs.Chooseweek.getMont(this.queryParams.timeValueBegin);
          }
        });
      }

      if (this.$store.state.user.treeList) {
        let { children, deptIds } = filterDepts(
          this.$store.state.user.treeList,
          this.$store.state.user.defaultDeptId
        );
        this.deptOptions = children;
        deptIds = deptIds.toString();
        // 判断是否部门是否存在 存在显示部门 否则是个人账号对其限制展示
        this.showList = this.$store.state.user.treeList;

        let treeList = this.$store.state.user.treeList;

        // 判断是否是最后一个部门 是的话获取其子类所有人员进行展示
        if (!children[0].children) {
          this.queryParams.deptId = treeList[0].id;
        }
        // 当前路由存在则不再获取部门值
        if (this.$route.query.timeType) {
        } else {
          this.queryParams.deptIds = deptIds;
        }

        this.getTreeselectList(this.deptOptions);
        this.getUserList(this.$store.state.user.defaultDeptId);
        // this.queryParams.deptId = this.deptOptions[0].id
      } else {
        //获取当前登录的部门
        this.queryParams.deptId = "";
        this.queryParams.deptIds = "";

        if (this.$route.query.timeType) {
        } else {
          this.queryParams.userId = this.$store.state.user.userId;
          this.showDepartment = false;
        }
        this.getTreeselectArr1 = [];
        this.showDepartSelect = false;
        this.userList = [
          {
            userId: "",
            userName: "",
          },
        ];
        this.userList[0].userId = this.$store.state.user.userId;
        this.userList[0].userName = this.$store.state.user.name;
        this.ableClear = false;
      }

      // }

      this.routerchanging();
      this.getDetailTopData();
      this.getIndexPieChar();
      this.getList();
      // this.getUserList(this.deptOptions[0].id);
    },
    routerchanging() {
      if (this.queryParams.deptIds) {
        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            // 对变量类型进行转换 不转换的话无法删除部门的第一项
            if (i == 200 || i == 100) {
              return Number(i);
            } else {
              return i;
            }
          });
      }

      // this.queryParams.deptIds = this.deptOptions[0].id;
      this.datesDataType = this.queryParams.timeType;
      this.dateDatas1 = this.queryParams.timeValueBegin;
      this.dateDatas2 = this.queryParams.timeValueEnd;
      if (this.datesDataType == 1) {
        this.setStartYear = this.queryParams.timeValueBegin;
        this.setEndYear = this.queryParams.timeValueEnd;
      }
      if (this.datesDataType == 2) {
        this.setStartMonth = this.queryParams.timeValueBegin;
        this.setEndMonth = this.queryParams.timeValueEnd;
      }
      if (this.datesDataType == 4) {
        this.setStartDay = this.queryParams.timeValueBegin;
        this.setEndDay = this.queryParams.timeValueEnd;
      }
    },
    typechanging() {
      this.echartsData[0] = "数据来源占比";
      if (this.type == 1) {
        this.tableTitle[0] = "线索分析详情";
        this.tableTitle[1] = "线索详情";
        this.echartsData[1] = "部门线索占比分布";
      }
      if (this.type == 3) {
        this.tableTitle[0] = "订单分析详情";
        this.tableTitle[1] = "订单详情";
        this.echartsData[1] = "部门商机占比分布";
        // this.echartsData[2] = "部门商机占比分布";
        this.echartsData[5] = "订单状态占比";
        this.echartsData[6] = "关联产品销售数量及金额分布图";
      }
      this.echartsData[3] = "跟进方式占比";
      if (this.type == 2) {
        this.tableTitle[0] = "商机分析详情";
        this.tableTitle[1] = "商机详情";
        this.echartsData[1] = "部门商机占比分布";
        // this.echartsData[2] = "部门商机占比分布";
        this.echartsData[4] = "商机状态漏斗";
        this.echartsData[5] = "商机状态占比";
        this.echartsData[6] = "关联产品分布";
      }
    },

    date(value) {
      this.queryParams.timeValueBegin = value[0];
      this.queryParams.timeValueEnd = value[1];
    },

    DrillingM(row) {
      this.queryParams.orderByColumn = "clueCount";
      this.queryParams.isAsc = "desc";
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      if (this.storageData == null) {
        this.storageData = [];
      }
      this.queryParams.setTimeType = this.timeType;
      this.storageData.push(this.queryParams);

      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      if (row.userId) {
        this.queryParams.deptId = undefined;
        this.queryParams.deptIds = undefined;
        this.getTreeselectArr1 = [];
        this.queryParams.userId = String(row.userId);
        this.showDepartment = false;
        this.queryParams.orderByColumn = undefined;
        this.queryParams.isAsc = undefined;
      } else {
        this.showDepartment = true;
        if (
          this.getTreeselectArr.some((i) => {
            return i == row.deptId;
          })
        ) {
          this.getTreeselectArr1 = [row.deptId];
          this.queryParams.deptId = this.getTreeselectArr1.join(",");
        } else {
          this.getTreeselectArr1 = [];
          this.getTreeselectList1(this.deptOptions, row.deptId);
          this.queryParams.deptIds = this.getTreeselectArr1.join(",");
        }
      }
      if (this.queryParams.deptId !== undefined) {
        this.queryParams.deptIds = this.queryParams.deptId;
      }

      var _this = this;

      this.$router.push({
        name: "PerformanceData",
        query: {
          deptId: this.queryParams.deptIds,
          userId: this.queryParams.userId,
          userName: this.queryParams.userName,

          orderByColumn: undefined,
          isAsc: undefined,
          timeType: this.timeType,
          timeValueBegin: _this.queryParams.timeValueBegin,
          timeValueEnd: _this.queryParams.timeValueEnd,
        },
      });
    },
    handleQuery1() {
      // delete this.queryParams.deptId;
      this.queryParams.pageNum = 1;
      this.getDetailTopData();
      this.getIndexPieChar();
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery1() {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      if (this.storageData == null || this.storageData.length == 0) {
        // 获取当前页面 URL
        const currentUrl = window.location.href;

        // 清空查询参数
        const newUrl = currentUrl.split("?")[0]; // 只保留问号之前的部分

        // 通过修改 URL 来实现页面重定向
        window.location.href = newUrl;

        this.queryParams.pageNum = 1;

        this.queryParams = {
          userId: "",
          timeType: 1,
          timeValueBegin: "2023",
          timeValueEnd: "2023",
          pageNum: 1,
          pageSize: 10,
        };
        this.timeType = 1;

        this.setStartYear = this.queryParams.timeValueBegin;
        this.setEndYear = this.queryParams.timeValueEnd;
        if (this.$store.state.user.treeList) {
          this.getTreeselectArr1 = [];
          this.deptOptions = this.$store.state.user.treeList;
          this.queryParams.deptIds = this.deptOptions[0].id;
          this.queryParams.deptId = this.deptOptions[0].id;
          this.getTreeselectArr1 = String(this.queryParams.deptIds)
            .split(",")
            .map((i) => {
              if (i == 200) {
                return Number(i);
              } else {
                return i;
              }
            });
        } else {
          this.queryParams.userId = this.$store.state.user.userId;
        }
      } else {
        this.queryParams.timeType = this.$route.query.timeType;
        this.queryParams.deptIds = this.$route.query.deptId;
        this.queryParams.timeValueBegin = this.$route.query.timeValueBegin;
        this.queryParams.timeValueEnd = this.$route.query.timeValueEnd;
        this.queryParams.userId = this.$route.query.userId;
        this.showQuery = true;
        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });
        this.timeType = this.queryParams.timeType;

        this.datesDataType = this.queryParams.timeType;
        if (this.datesDataType == 1) {
          this.setStartYear = this.queryParams.timeValueBegin;
          this.setEndYear = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 2) {
          this.setStartMonth = this.queryParams.timeValueBegin;
          this.setEndMonth = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 4) {
          this.setStartDay = this.queryParams.timeValueBegin;
          this.setEndDay = this.queryParams.timeValueEnd;
        }
        if (this.datesDataType == 3) {
          this.$nextTick(() => {
            if (this.timeType == 3) {
              let data = this.$route.query.timeValueBegin;

              this.$refs.Chooseweek.getMont(data);
            }
          });
        }
      }

      this.getTreeselect();
      this.typechanging();
      // this.getDetailTopData();
    },
    // 获取列表
    getList() {
      // 获取存储在session当中的数据 如果有则显示返回按钮 如果没有则是在第一层 隐藏返回按钮
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      if (this.storageData == null || this.storageData.length == 0) {
        this.showBack = false;
      } else {
        this.showBack = true;
      }

      this.deptName = "部门";
      this.loading4 = true;
      if (this.queryParams.userId) {
        if (this.type == 1) {
          getDetailUserList(this.queryParams).then((res) => {
            this.list = res.data.rows;
            this.total = res.data.total;
            this.loading4 = false;
          });
        }
        if (this.type == 2) {
          getOpportunityDetailUserList(this.queryParams).then((res) => {
            this.list = res.data.rows;
            this.total = res.data.total;
            this.loading4 = false;
          });
        }
        if (this.type == 3) {
          getOrderDetailUserList(this.queryParams).then((res) => {
            this.list = res.rows;
            this.total = res.total;
            this.loading4 = false;
          });
        }
      } else {
        delete this.queryParams.userId;
        if (this.type == 1) {
          if (this.queryParams.orderByColumn) {
          } else {
            this.queryParams.orderByColumn = "clueCount";
            this.queryParams.isAsc = "desc";
          }
          if (
            this.getTreeselectArr.some((i) => {
              return i == this.queryParams.deptId;
            })
          ) {
            getDetailDeptUserList(this.queryParams).then((res) => {
              this.list = res.data.rows;
              this.total = res.data.total;
              this.loading4 = false;
            });
          } else {
            this.deptName = "主体";
            getClueDetailDeptList(this.queryParams).then((res) => {
              this.list = res.data.rows;
              this.total = res.data.total;
              this.loading4 = false;
            });
          }
        }
        if (this.type == 2) {
          if (this.queryParams.orderByColumn) {
          } else {
            this.queryParams.orderByColumn = "opportunityCount";
            this.queryParams.isAsc = "desc";
          }
          if (
            this.getTreeselectArr.some((i) => {
              return i == this.queryParams.deptId;
            })
          ) {
            getOpportunityDetailDeptUserList(this.queryParams).then((res) => {
              this.list = res.data.rows;
              this.total = res.data.total;
              this.loading4 = false;
            });
          } else {
            this.deptName = "主体";
            getOpportunityDetailDeptList(this.queryParams).then((res) => {
              this.list = res.data.rows;
              this.total = res.data.total;
              this.loading4 = false;
            });
          }
        }
        if (this.type == 3) {
          if (this.queryParams.orderByColumn) {
          } else {
            this.queryParams.orderByColumn = "orderCount";
            this.queryParams.isAsc = "desc";
          }
          if (
            this.getTreeselectArr.some((i) => {
              return i == this.queryParams.deptId;
            })
          ) {
            getOrderDetailDeptUserList(this.queryParams).then((res) => {
              this.list = res.rows;
              this.total = res.total;
              this.loading4 = false;
            });
          } else {
            this.deptName = "主体";
            getOrderDetailDeptList(this.queryParams).then((res) => {
              this.list = res.rows;
              this.total = res.total;
              this.loading4 = false;
            });
          }
        }
      }
    },

    handleClick({
      type,
      archiveId,
      clueName,
      deptId,
      userId,
      isLoss,
      namesang,
      userName,
    }) {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      if (this.storageData == null) {
        this.storageData = [];
      }
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;
      this.queryParams.setTimeType = this.timeType;
      this.storageData.push(this.queryParams);
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      var _this = this;
      this.$router.push({
        name: "Detailed",
        query: {
          type,
          archiveId,
          clueName,
          deptIds: deptId ? deptId : this.queryParams.deptIds,
          userId: userId ? userId : this.queryParams.userId,
          userName: userName ? userName : this.queryParams.userName,
          isLoss,
          namesang,
          orderByColumn: undefined,
          isAsc: undefined,
          timeType: this.timeType,
          timeValueBegin: _this.queryParams.timeValueBegin,
          timeValueEnd: _this.queryParams.timeValueEnd,
          detailedType:
            type == 4
              ? this.type == 1
                ? 1
                : this.type == 2
                ? 3
                : 4
              : undefined,
        },
      });
    },
    // 详情页 顶部 数据概览
    getDetailTopData() {
      this.loading1 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));

      queryParams.timeType == 4 ? 3 : queryParams.timeType;

      if (this.type == 1) {
        getDetailTopData(queryParams).then((res) => {
          this.tabData = [
            [
              {
                lable: "线索数量",
                key: "clueCount",
                value: 0,
              },
              {
                lable: "线索环比增长率",
                key: "clueIncreaseRate",
                value: "%",
              },
              {
                lable: "转商机数量",
                key: "opportunityCount",
                value: 0,
              },
              {
                lable: "转商机转化率",
                key: "opportunityTransRate",
                value: "%",
              },
              {
                lable: "转订单数量",
                key: "orderCount",
                value: 0,
              },
              {
                lable: "转订单转化率",
                key: "orderTransRate",
                value: "%",
              },
              {
                lable: "转客户数量",
                key: "customerCount",
                value: 0,
              },
              {
                lable: "转客户转化率",
                key: "customerTransRate",
                value: "%",
              },
              {
                lable: "转介绍成交数量",
                key: "referralCustomerCount",
                value: 0,
              },
              {
                lable: "线索质量",
                key: "clueQuality",
                value: 0,
              },
              {
                lable: "跟进次数",
                key: "followUpCount",
                value: 0,
              },
              {
                lable: "跟进内容量",
                key: "followUpContentCount",
                value: 0,
              },
              {
                lable: "跟进密度",
                key: "followUpDensity",
                value: 0,
              },
            ],
          ];
          this.tabData[0].forEach((element) => {
            if (res.data[element.key]) {
              if (typeof element.value == "number") {
                element.value = res.data[element.key];
              } else {
                element.value =
                  (res.data[element.key] ? res.data[element.key] : "0") +
                  element.value;
              }
            } else {
              if (typeof element.value == "number") {
                element.value = "0";
              } else {
                element.value = "0" + element.value;
              }
            }
          });
          this.loading1 = false;
        });
      }
      if (this.type == 2) {
        getOpportunityDetailTopData(queryParams).then((res) => {
          this.tabData1 = [
            [
              {
                lable: "商机数量",
                key: "opportunityCount",
                value: 0,
              },
              {
                lable: "商机环比增长率",
                key: "opportunityIncreaseRate",
                value: "%",
              },
              {
                lable: "转订单数量",
                key: "orderCount",
                value: 0,
              },
              {
                lable: "转订单转化率",
                key: "orderTransRate",
                value: "%",
              },
              {
                lable: "转客户数量",
                key: "customerCount",
                value: 0,
              },
              {
                lable: "转客户转化率",
                key: "customerTransRate",
                value: "%",
              },
              {
                lable: "转介绍成交数量",
                key: "referralCustomerCount",
                value: 0,
              },
              {
                lable: "商机质量",
                key: "opportunityQuality",
                value: 0,
              },
              {
                lable: "跟进次数",
                key: "followUpCount",
                value: 0,
              },
              {
                lable: "跟进内容量",
                key: "followUpContentCount",
                value: 0,
              },
              {
                lable: "跟进密度",
                key: "followUpDensity",
                value: 0,
              },
              {
                lable: "流失商机",
                key: "lossOpportunityCount",
                value: 0,
              },
            ],
          ];
          this.tabData1[0].forEach((element) => {
            if (res.data[element.key]) {
              if (typeof element.value == "number") {
                element.value = res.data[element.key];
              } else {
                element.value =
                  (res.data[element.key] ? res.data[element.key] : "0") +
                  element.value;
              }
            } else {
              if (typeof element.value == "number") {
                element.value = "0";
              } else {
                element.value = "0" + element.value;
              }
            }
          });
          this.loading1 = false;
        });
      }
      if (this.type == 3) {
        getOrderDetailTopData(queryParams).then((res) => {
          this.tabData2 = [
            [
              {
                lable: "订单数量",
                key: "orderCount",
                value: 0,
              },
              {
                lable: "订单环比增长率",
                key: "orderIncreaseRate",
                value: "%",
              },
              {
                lable: "订单金额",
                key: "orderAmount",
                value: 0,
              },
              {
                lable: "平均订单金额",
                key: "avgOrderAmount",
                value: 0,
              },
              {
                lable: "转客户数量",
                key: "convertCustomerCount",
                value: 0,
              },
              {
                lable: "关联产品数",
                key: "associatedProductCount",
                value: 0,
              },
              {
                lable: "跟进次数",
                key: "followUpCount",
                value: 0,
              },
              {
                lable: "跟进内容量",
                key: "followUpContentCount",
                value: 0,
              },
              {
                lable: "跟进密度",
                key: "followUpDensity",
                value: 0,
              },
            ],
          ];
          this.tabData2[0].forEach((element) => {
            if (res.data[element.key]) {
              if (typeof element.value == "number") {
                element.value = res.data[element.key];
              } else {
                element.value =
                  (res.data[element.key] ? res.data[element.key] : "0") +
                  element.value;
              }
            } else {
              if (typeof element.value == "number") {
                element.value = "0";
              } else {
                element.value = "0" + element.value;
              }
            }
          });
          this.loading1 = false;
        });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/zw/customerAnalysis/export",
        {
          ...this.query,
          ...this.queryParams,
        },
        `业绩数据_${new Date().getTime()}.xlsx`
      );
    },
    // 首页 中部 饼图
    getIndexPieChar() {
      this.loading2 = true;
      this.loading5 = true;
      this.loading3 = true;

      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      if (this.type == 1) {
        getIndexPieChar(queryParams).then((res) => {
          if (
            res.data.dataSourcePieChart &&
            res.data.dataSourcePieChart.length
          ) {
            this.echartData1 = res.data.dataSourcePieChart;
          } else {
            this.echartData1 = [{ name: "无", value: 0 }];
          }

          if (res.data.deptCluePieChart && res.data.deptCluePieChart.length) {
            this.echartData2 = res.data.deptCluePieChart;
          } else {
            this.echartData2 = [{ name: "无", value: 0 }];
          }
          if (
            res.data.followUpMethodPieChart &&
            res.data.followUpMethodPieChart.length
          ) {
            this.echartData4 = res.data.followUpMethodPieChart;
          } else {
            this.echartData4 = [{ name: "无", value: 0 }];
          }
          this.loading2 = false;
        });
      }
      if (this.type == 2) {
        var queryP = JSON.parse(JSON.stringify(queryParams));
        // delete queryP.userId;
        delete queryP.pageNum;
        delete queryP.pageSize;
        getOpportunityDetailPieChar(queryP).then((res) => {
          if (
            res.data.dataSourcePieChart &&
            res.data.dataSourcePieChart.length
          ) {
            this.echartData1 = res.data.dataSourcePieChart;
          } else {
            this.echartData1 = [{ name: "无", value: 0 }];
          }

          if (
            res.data.deptOpportunityPieChart &&
            res.data.deptOpportunityPieChart.length
          ) {
            this.echartData2 = res.data.deptOpportunityPieChart;
          } else {
            this.echartData2 = [{ name: "无", value: 0 }];
          }
          if (
            res.data.followUpMethodPieChart &&
            res.data.followUpMethodPieChart.length
          ) {
            this.echartData4 = res.data.followUpMethodPieChart;
          } else {
            this.echartData4 = [{ name: "无", value: 0 }];
          }
          this.loading2 = false;
        });

        getOpportunityProjectMatrixChartVo(queryP).then((res) => {
          const {
            educationCenter,
            enterpriseServices,
            talentServices,
            vocationalTrainingServices,
          } = res.data;

          const totalValue1 = educationCenter.map((item) => item.count);
          const totalValue2 = enterpriseServices.map((item) => item.count);
          const totalValue3 = talentServices.map((item) => item.count);
          const totalValue4 = vocationalTrainingServices.map(
            (item) => item.count
          );
          this.echartData7 = [
            {
              name: "企业服务",
              value: 1,
              children: enterpriseServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "职训服务",
              value: 1,
              children: vocationalTrainingServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "人才服务",
              value: 1,
              children: talentServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "教育中心",
              value: 1,
              children: educationCenter.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
          ];
          this.loading5 = false;
        });

        getOpportunityStatusPieChart(queryP).then((res) => {
          this.echartData6 = res.data;
          var echartData5 = [];
          res.data.forEach((res) => {
            if (res.name == "合同阶段") {
              echartData5[4] = {
                name: res.name,
                value1: res.value,
                value: res.value,
              };
            }
            if (res.name == "促成及处理异议") {
              echartData5[3] = {
                name: res.name,
                value1: res.value,
                value: res.value,
              };
            }
            if (res.name == "提供解决方案") {
              echartData5[2] = {
                name: res.name,
                value1: res.value,
                value: res.value,
              };
            }
            if (res.name == "确认需求") {
              echartData5[1] = {
                name: res.name,
                value1: res.value,
                value: res.value,
              };
            }
            if (res.name == "发现需求") {
              echartData5[0] = {
                name: res.name,
                value1: res.value,
                value: res.value,
              };
            }
          });
          this.echartData5 = echartData5;
          this.loading3 = false;
        });
      }
      if (this.type == 3) {
        var queryP = JSON.parse(JSON.stringify(queryParams));
        // delete queryP.userId;
        delete queryP.pageNum;
        delete queryP.pageSize;
        getOrderDetailPieChart(queryP).then((res) => {
          if (
            res.data.dataSourcePieChart &&
            res.data.dataSourcePieChart.length
          ) {
            this.echartData1 = res.data.dataSourcePieChart;
          } else {
            this.echartData1 = [{ name: "无", value: 0 }];
          }

          if (res.data.deptCluePieChart && res.data.deptCluePieChart.length) {
            this.echartData2 = res.data.deptCluePieChart;
          } else {
            this.echartData2 = [{ name: "无", value: 0 }];
          }
          if (
            res.data.followUpMethodPieChart &&
            res.data.followUpMethodPieChart.length
          ) {
            this.echartData4 = res.data.followUpMethodPieChart;
          } else {
            this.echartData4 = [{ name: "无", value: 0 }];
          }
          this.loading2 = false;
        });

        getOrderDetailMatrixChart(queryP).then((res) => {
          const {
            educationCenter,
            enterpriseServices,
            talentServices,
            vocationalTrainingServices,
          } = res.data;

          const totalValue1 = educationCenter.map((item) => item.count);
          const totalValue2 = enterpriseServices.map((item) => item.count);
          const totalValue3 = talentServices.map((item) => item.count);
          const totalValue4 = vocationalTrainingServices.map(
            (item) => item.count
          );

          this.echartData7 = [
            {
              name: "企业服务",
              value: 1,
              children: enterpriseServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "职训服务",
              value: 1,
              children: vocationalTrainingServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "人才服务",
              value: 1,
              children: talentServices.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
            {
              name: "教育中心",
              value: 1,
              children: educationCenter.map((i) => ({
                name: i.name,
                value: [i.count],
              })),
            },
          ];
          this.loading5 = false;
        });
        getOrderPieChart(queryP).then((res) => {
          this.echartData6 = res.map((item) => {
            return {
              value: item.orderCount,
              name: item.orderStatusName,
            };
          });
          this.loading3 = false;
        });
      }
    },

    sortChange({ column, prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order === "descending" ? "desc" : "asc";
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 调取用户列表
    getDataList() {
      this.loading4 = true;
      var queryParams = JSON.parse(JSON.stringify(this.queryParams));
      queryParams.timeType =
        queryParams.timeType == 4 ? 3 : queryParams.timeType;
      deptJumpEmployeesList({ ...queryParams, ...this.query }).then((res) => {
        this.total = res.total;
        this.list = res.rows;
        // 【客户价值质量】：计算算法：【（VIP客户数量*30%+A类客户数量*27%+B类客户数量*23%+C类客户数量*20%）/4】/100】；
        this.list.forEach((item) => {
          let [customerA, customerB, customerC, customerVIP] = [0, 0, 0, 0];
          item.customerGradeList.forEach((val) => {
            const { customerGrade, customerGradeCount } = val;
            if (customerGrade == 1) customerC = customerGradeCount;
            if (customerGrade == 2) customerB = customerGradeCount;
            if (customerGrade == 3) customerA = customerGradeCount;
            if (customerGrade == 4) customerVIP = customerGradeCount;
          });
          let num =
            (customerVIP * 0.3 +
              customerA * 0.27 +
              customerB * 0.23 +
              customerC * 0.2) /
            4 /
            100;
          item.customerA = customerA;
          item.customerB = customerB;
          item.customerC = customerC;
          item.customerVIP = customerVIP;
          item.customerValueQuality = num.toFixed(6);

          item.customerCount =
            Number(customerA) +
            Number(customerB) +
            Number(customerC) +
            Number(customerVIP);
        });

        this.loading4 = false;
      });
    },
    //  时间发生变化后存储起来传递给子页面
    dataTypeChange() {
      this.$store.commit("ADD_TIME_STATUS", this.queryParams);
    },
    goBack() {
      this.storageData = JSON.parse(sessionStorage.getItem("storageDatas"));
      this.queryParams = this.storageData.pop();
      sessionStorage.setItem("storageDatas", JSON.stringify(this.storageData));
      this.timeType = this.queryParams.timeType;

      if (this.queryParams.userId !== "") {
        this.showDepartment = false;
      } else {
        this.showDepartment = true;
      }
      if (this.queryParams.userId == undefined) {
        this.showDepartment = true;
      }

      if (this.queryParams.deptIds)
        this.getTreeselectArr1 = String(this.queryParams.deptIds)
          .split(",")
          .map((i) => {
            if (i == 200) {
              return Number(i);
            } else {
              return i;
            }
          });

      this.routerchanging();
      this.getDetailTopData();
      this.getIndexPieChar();
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.topTitle {
  display: flex;
  height: 40px;
  background-color: rgb(232, 238, 240);

  .topTitleList {
    cursor: pointer;
    text-align: center;
    width: 150px;
    height: 100%;
    // margin: 10px 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
  }

  .topTitleListR {
    background-color: rgb(131, 97, 226);
    color: #fff;
  }

  .po {
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid rgb(131, 97, 226);
  }
}

.PerformanceData-tit {
  background-color: rgb(232, 238, 240);
  padding: 15px 10px;
  font-size: 20px;
  font-weight: 600;
  margin-top: 10px;
}

.grid {
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;

  .el-card {
    &:nth-child(2) {
      margin: 0 10px;
    }

    &:nth-child(3) {
      margin: 0 10px;
    }

    flex: 1;
  }
}

.menu-box {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
}

.item:hover {
  background-color: #f9f9f9;
}

.item div {
  margin-top: 20px;
}

.item div:nth-child(1) {
  color: rgb(0, 121, 254);
  font-size: 16px;
}

.item div:nth-child(2) {
  color: #000;
  font-size: 18px;
}

.header-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(232, 238, 240);
  padding: 10px 10px;
  margin-top: 10px;

  span {
    font-size: 20px;
    font-weight: 600;
  }
}

.flextop {
  display: flex;
  justify-content: space-between;
  height: 30px;
}

.vue-treeselect {
  margin-right: 10px;
}

::v-deep .vue-treeselect__control {
  width: 350px;
  min-height: 30px;
  line-height: 32px;
}

::v-deep .vue-treeselect__multi-value-item {
  height: 22px;
}

::v-deep .vue-treeselect__multi-value-item-container {
  height: 25px;
}

::v-deep .vue-treeselect__multi-value-item {
  display: block;
  line-height: 18px;
  height: 22px;
}

::v-deep .vue-treeselect__value-container {
  width: 400px;
  line-height: normal;
}

::v-deep .vue-treeselect__control-arrow-container {
  display: block;
  position: absolute;
  top: 2px;
  right: 8px;
  width: 12px;
  height: 30px;
  line-height: 32px;
}
</style>